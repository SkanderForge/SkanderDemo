import * as d3 from "d3";
import {GeoPermissibleObjects} from "d3";
import React from "react";
import * as topojson_spec from "topojson-specification";
import * as topojson_server from "topojson-server";
import {GeoJSON} from "geojson";
import * as topojson from "topojson-client";
import {MapLayer} from "@/utils/map/mapLayer";
import mapmodes, {cleanLayer} from "@/utils/map/mapmodes";
import {TMapmode} from "@/utils/types/map";
import {Topology} from "topojson-specification";
import {MapLayerBank} from "@/utils/map/mapLayerBank";

export class Map {


    public geoJson?: GeoJSON.FeatureCollection;
    public topoJson?: topojson_spec.Topology;
    public path?: d3.GeoPath<GeoPermissibleObjects>;
    private svgRef: React.RefObject<SVGElement>;
    private svg: any;
    private mapHeight: number = 0;
    private mapWidth: number = 0;
    private bounds: [[number, number], [number, number]] = [[0, 0], [0, 0]];
    private initialX: number = 0;
    private initialY: number = 0;
    private lastK: number = 1;
    private layerBank: MapLayerBank;
    private shapes?: GeoJSON.FeatureCollection;
    public dataBanks?: { [key: string]: {} } = {"saveData": []};
    public currentMapmode: string = "";
    public Settings = {
        bgVisible: true,
        cBordersVisible: true,
        pBordersVisible: true,
        enableOverlay: true,
    }

    private styleOverrides: CSSStyleDeclaration[] = [];


    constructor(svgRef: React.RefObject<SVGElement>) {
        console.log("Initializing the Map processor class...");
        this.svgRef = svgRef;
        this.svg = d3.select(svgRef.current);
        this.svg.call(this.zoomHandler);
        this.layerBank = new MapLayerBank();
    }

    public _setDataBank(key: string, dataBank: Array<Array<any>>) {
        if (!this.dataBanks) return;
        this.dataBanks[key] = dataBank;
    }

    toggleDisplayBackground = () => {
        let el = this.svg.select("#map_background");
        (this.Settings.bgVisible) ? el.style("display", "none") : el.style("display", "inline");
        this.Settings.bgVisible = !this.Settings.bgVisible;
        this.executeMapmode(this.currentMapmode);
    }

    /**
     * D3 transformer function that runs over our input GeoJSON/TopoJSON
     * and rescales each individual coordinate.
     * This is useful for flipping the axes, or just reducing the resulting SVG
     * without relying on transforms.
     * @param scaleFactor
     */
    scale = (scaleFactor: number) => {
        return d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x * scaleFactor, (y * -scaleFactor))
            }
        });
    }
    /**
     * This took way longer than it had any right to...
     *
     * The map is rendered from x=0 y=0, left-to-right.
     * Panning actually happens by literally moving the map.
     * To see further "to the right", the map has to move to the left,
     * hence when it comes to transformations all distances we're going to be dealing with
     * will be negative.
     *
     * Current location of the "camera" is defined by the position of the upper-left corner of the window.
     * Hence, the boundaries to the 'left' and 'up' will always be 0.
     * To get the boundaries of the "right" and "down" we get the size of the map, and remove the sizes of
     * the current map window, to simulate the distance from bottom-right corner to top-left.
     */
    zoomHandler = d3.zoom()
        .scaleExtent([-0, 50]).on("zoom", r => {
            let mapWidth = -this.mapWidth;
            let mapHeight = this.mapHeight;
            let clientWidth = (this.svgRef.current?.clientWidth ?? 0);
            let clientHeight = (this.svgRef.current?.clientHeight ?? 0)
            const mins = {
                lX: 0,
                lY: 0,
                rX: (mapWidth * r.transform.k) + clientWidth - 200,
                rY: (mapHeight * r.transform.k) + clientHeight - 200,
            }
            if (r.transform.x > mins.lX) this.svg.node().__zoom.x = mins.lX;
            if (r.transform.y > mins.lY) this.svg.node().__zoom.y = mins.lY;
            if (r.transform.x < mins.rX) this.svg.node().__zoom.x = mins.rX;
            if (r.transform.y < mins.rY) this.svg.node().__zoom.y = mins.rY;
            this.svg.select("#main_map").attr("transform", r.transform);
        })


    /**
     * Runs the cleanup & initial set-up for the map.
     * layer1/layer2/
     * @param provincesShapes
     */
    initializeSvg = (provincesShapes: GeoJSON.FeatureCollection) => {
        this.svg.select("layer1").selectAll("*").remove();
        this.svg.select("layer2").selectAll("*").remove();
        this.svg.select("layer3").selectAll("*").remove();

        this.svg.select("#layer0")
            .append("image")
            .attr("id", "map_background")
            .attr("href", "/world_map_vanilla.webp")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 5632)
            .attr("height", 2048)

        this.svg.style("width", "100vw");
        this.svg.style("height", "100vh");

        this.path = d3.geoPath().projection(this.scale(1));
        //Our base input is a geoJson FeatureCollection. This converts it into TopoJson.
        //This could, in theory, be processed backend-side, but it doesn't seem very bandwidth efficient.
        this.topoJson = topojson_server.topology({provincesShapes}) as Topology;

        this.geoJson = topojson.feature(this.topoJson, this.topoJson.objects.provincesShapes) as GeoJSON.FeatureCollection;
        this.shapes = provincesShapes;
        // Calculates map's size based on the input shapes, and sets the default camera position.
        this.bounds = this.path.bounds(this.geoJson);
        this.mapHeight = -this.bounds[1][1];
        this.mapWidth = this.bounds[1][0];

        //See below for explanation
        this.drawFirstLayer(provincesShapes);


        // @ts-ignore
        //let foo = topojson.merge(this.topoJson, this.topoJson.objects.provincesShapes?.geometries.filter((d: any) => {
        //let layer = this.layerBank.get(1, d.properties.id);
        //return layer.data.owner === "RUS";
        //}));
        //console.log(foo);

        this.drawSecondLayer()
    }


    drawFirstLayer = (provincesShapes: GeoJSON.FeatureCollection) => {
        let pathConverter = this.path as d3.GeoPath;
        for (let layer of provincesShapes.features) {
            let centroid = this.path?.centroid(layer) as [number, number];
            this.svg.select("#layer1").append("path")
                .attr("d", pathConverter(layer))
                .attr("id", layer.properties?.id)
                .on("click", (e: any) => {
                    console.log(e)
                })
                .style("fill", "none");
            let layerObj = new MapLayer({
                id: layer.properties?.id,
                type: "first",
                dataBanks: this.dataBanks,
                centroid: centroid,
            });
            this.layerBank.first().push(layerObj);
        }
        // this.styleOverrides.push(new CSSStyleDeclaration());
    }
    drawSecondLayer = () => {
        let pathConverter = this.path as d3.GeoPath;
        let topoJson = this.topoJson as Topology;
        if (!this.dataBanks?.saveData) return;
        let saveData = this.dataBanks.saveData;

        let tagNames = Object.keys(saveData);
        for (const tagName of tagNames) {
            // @ts-ignore
            if (!saveData[tagName]['hex']) continue;
            // @ts-ignore
            if (typeof saveData[tagName]['total_development'] == "undefined") continue;

            this.svg.select("#layer2").append("path")
                // @ts-ignore
                .datum(topojson.merge(topoJson, topoJson.objects.provincesShapes?.geometries.filter((d: any) => {
                    let layer = this.layerBank.get(1, d.properties.id);
                    return layer.data.owner === tagName;
                })))
                .attr("class", "l2")
                .style("fill", "none")
                .style("stroke-width", "2px")
                .style("stroke", "#000")
                .style("pointer-events", "none")
                .attr("id", tagName)
                .attr("d", pathConverter);
            let layerObj = new MapLayer({
                id: tagName,
                type: "second",
                dataBanks: this.dataBanks
            });
            this.layerBank.second().push(layerObj);
        }
        //this.styleOverrides.push(new CSSStyleDeclaration());
    }
    toggleLayerBorderVisibility = (level: number) => {
        if (level === 2) this.Settings.cBordersVisible = !this.Settings.cBordersVisible;
        if (level === 1) this.Settings.pBordersVisible = !this.Settings.pBordersVisible;
        if (!this.svg.select(`#layer${level}`).style("--strokeOpacity")) {
            this.svg.select(`#layer${level}`).style("--strokeOpacity", "0")
        } else {
            this.svg.select(`#layer${level}`).style("--strokeOpacity", "");
        }
        this.executeMapmode(this.currentMapmode);
    }
    toggleMapmodeOverlayPreferences = (value: boolean) => {
        console.log("Here!");
        this.Settings.enableOverlay = value;
        this.executeMapmode(this.currentMapmode);
        console.log(this.currentMapmode, this.Settings);
    }

    downloadAsPng() {
        alert("NO CAN DOO");
    };

    executeMapmode = (mapmodeName: string) => {
        //if(mapmodeName === this.currentMapmode) return;
        let chosenMapmode: TMapmode = mapmodes[mapmodeName] as TMapmode;
        this.svg.select("#layer1_sub").selectAll("*").remove();
        this.svg.select("#layer2_sub").selectAll("*").remove();
        this.svg.select("#layer3_sub").selectAll("*").remove();
        for (let layer of this.layerBank.first()) {
            if (chosenMapmode.firstLayerStyleGenerator) {
                chosenMapmode.firstLayerStyleGenerator({
                    layer: layer,
                    caller: this,
                    svg: this.svg,
                    dataBanks: this.dataBanks,
                    settings: this.Settings,
                    styleOverrides: this.styleOverrides,
                });
            }
        }
        for (let layer of this.layerBank.second()) {
            if (chosenMapmode.secondLayerStyleGenerator) {
                chosenMapmode.secondLayerStyleGenerator({
                    layer: layer,
                    caller: this,
                    svg: this.svg,
                    dataBanks: this.dataBanks,
                    settings: this.Settings,
                    styleOverrides: this.styleOverrides,
                });
            }
        }

        this.currentMapmode = mapmodeName;
    }
}