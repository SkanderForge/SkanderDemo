import * as d3 from "d3";
import {GeoPermissibleObjects} from "d3";
import React from "react";
import * as topojson_spec from "topojson-specification";
import * as topojson_server from "topojson-server";
import {GeoJSON} from "geojson";
import * as topojson from "topojson-client";


export class Map {
    zoomHandler = d3.zoom().scaleExtent([-50, 50]).on("zoom", r => {
        const mins = {
            lX: 0,
            lY: 0,
            rX: -this.mapWidth - (this.svgRef.current?.clientWidth ?? 0),
            rY: this.mapHeight + (this.svgRef.current?.clientHeight ?? 0)
        }
        //We have to update the internal _zoom coordinates, so that when panning back in the right direction
        //there's no time needed to "make up" the erroneous panning from earlier out of bounds.
        // if(r.transform.x > mins.lX){this.svg.node().__zoom.x=mins.lX;return;}
        // if(r.transform.y > mins.lY){this.svg.node().__zoom.y=mins.lY;return;}
        //   if(r.transform.x < mins.rX){this.svg.node().__zoom.x=mins.rX;return;}
        //  if(r.transform.y < mins.rY){this.svg.node().__zoom.y=mins.rY;return;}
        this.svg.select("#main_map").attr("transform", r.transform);
        this.svg.select("#map_background").style("opacity", (a: any) => {
            if (r.transform.k > 1) {
                //return 1/r.transform.k;
            }
            return 1;
        })


        let multiplier = 1;
        if (r.transform.k > this.lastK) {
            multiplier = (r.transform.k / this.lastK) / 1.5;
        } else if (r.transform.k < this.lastK) {
            multiplier = (r.transform.k / this.lastK) * 1.5;
        }
        if (multiplier === 1) return;
        this.lastK = r.transform.k;
        for (let item of Array.from(document.getElementsByTagName("path"))) {
            this.lastK = r.transform.k;
            let currWidth = parseFloat(item.style.strokeWidth.split("px")[0]);
            item.style.strokeWidth = `${currWidth * multiplier}px`;
        }
    })

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

    constructor(svgRef: React.RefObject<SVGElement>) {
        console.log("Initializing the Map processor class...");
        this.svgRef = svgRef;
        this.svg = d3.select(svgRef.current);
        this.svg.call(this.zoomHandler);
    }

    public _toggleDisplayBackground = () => {
        let el = this.svg.select("#map_background");
        (el.style("display") === "none") ? el.style("display", "inline") : el.style("display", "none");
    }

    scale = (scaleFactor: number) => {
        return d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x * scaleFactor, (y * -scaleFactor))
            }
        });
    }

    get toggleDisplayBackground(): () => void {
        return this._toggleDisplayBackground;
    }

    /**
     * Runs the cleanup & initial set-up for the map.
     * @param provincesShapes
     */
    initializeSvg = (provincesShapes: GeoJSON.FeatureCollection) => {
        this.svg.select("g").selectAll("*").remove();
        this.svg.select("#main_map")
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
        this.topoJson = topojson_server.topology({provincesShapes});
        this.geoJson = topojson.feature(this.topoJson, this.topoJson.objects.provincesShapes) as GeoJSON.FeatureCollection;

        // Calculates map's size based on the input shapes, and sets the default camera position.
        this.bounds = this.path.bounds(this.geoJson);
        this.mapHeight = -this.bounds[1][1];
        this.mapWidth = this.bounds[1][0];
        this.initialX = -this.mapWidth / 2 + (this.svgRef.current?.clientWidth ?? 0) / 2;
        this.initialY = this.mapHeight / 2 + (this.svgRef.current?.clientHeight ?? 0) / 2;

        this.svg.select("#main_map").attr("transform", `translate(${this.initialX},${this.initialY})`);
        this.svg.node().__zoom.x = this.initialX;
        this.svg.node().__zoom.y = this.initialY;
    }
}