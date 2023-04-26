import * as d3 from "d3";
import {GeoPermissibleObjects} from "d3";
import React from "react";
import * as topojson_spec from "topojson-specification";
import * as topojson_server from "topojson-server";
import {GeoJSON} from "geojson";
import * as topojson from "topojson-client";


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
    zoomHandler = d3.zoom().scaleExtent([-50, 50]).on("zoom", r => {

        this.svg.select("g").attr("transform", r.transform);
        let multiplier = 1;
        if (r.transform.k > this.lastK) {
            multiplier = (r.transform.k / this.lastK) / 1.5;
        } else if (r.transform.k < this.lastK) {
            multiplier = (r.transform.k / this.lastK) * 1.5;
        }
        if (multiplier === 1) return;
        this.lastK = r.transform.k;
        console.log(multiplier);
        for (let item of Array.from(document.getElementsByTagName("path"))) {
            this.lastK = r.transform.k;
            let currWidth = parseFloat(item.style.strokeWidth.split("px")[0]);
            item.style.strokeWidth = `${currWidth * multiplier}px`;
        }
    })

    constructor(svgRef: React.RefObject<SVGElement>) {
        console.log("Boilerplate class");
        this.svgRef = svgRef;
        this.svg = d3.select(svgRef.current);
        this.svg.call(this.zoomHandler);
    }

    scale = (scaleFactor: number) => {
        return d3.geoTransform({
            point: function (x, y) {
                this.stream.point(x * scaleFactor, (y * -scaleFactor))
            }
        });
    }

    /**
     * Runs the cleanup & initial set-up for the map.
     * @param provincesShapes
     */
    initializeSvg = (provincesShapes: GeoJSON.FeatureCollection) => {
        this.svg.selectAll("*").remove();
        this.svg.append("g").attr("id", "province_shapes")
        this.svg.select("#province_shapes")
            .append("image")
            .attr("href", "/world_map_vanilla.png")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 5632 / 2)
            .attr("height", 2048 / 2)

        this.svg.style("width", "100vw");
        this.svg.style("height", "100vh");


        this.path = d3.geoPath().projection(this.scale(0.5));
        this.topoJson = topojson_server.topology({provincesShapes});
        this.geoJson = topojson.feature(this.topoJson, this.topoJson.objects.provincesShapes) as GeoJSON.FeatureCollection;

        // Calculates map's size based on the input shapes, and sets the default camera position.
        this.bounds = this.path.bounds(this.geoJson);
        this.mapHeight = -this.bounds[0][1];
        this.mapWidth = this.bounds[1][0];
        this.initialX = -this.mapWidth / 2 / 3// - (this.svgRef.current?.clientWidth ?? 0) / 2;
        this.initialY = this.mapHeight / 2 / 2// + (this.svgRef.current?.clientHeight ?? 0) / 2;
        this.svg.select("g").attr("transform", `translate(${this.initialX},${this.initialY})`);
        this.svg.node().__zoom.x = this.initialX;
        this.svg.node().__zoom.y = this.initialY;
    }
}