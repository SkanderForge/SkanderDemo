import * as d3 from "d3";
import Graph from "node-dijkstra";
import {distanceBetween, findIntersection, simplify} from "@/utils/map/mapHelpers";

const d3Voronoi = require("d3-voronoi");

export function mapCenterlineGenerator(path) {
    let svg = d3.select("svg");
    return process(path);

    function process(path) {
        const length = path.getTotalLength();
        const numPoints = Math.min(Math.floor(length / 25), 15);
        const polygon = d3.range(numPoints)
            .map(i => path.getPointAtLength(length * i / numPoints))
            .map(d => [d.x, d.y]);

        // const hull = d3.polygonHull(polygon);
        // const line = d3.line()
        //     .curve(d3.curveLinearClosed);
        // svg.append("path")
        //     .attr("id", "debug_polygon")
        //     .attr("d", line(hull));


        const [x0, x1] = d3.extent(polygon.map(d => d[0])),
            [y0, y1] = d3.extent(polygon.map(d => d[1]));

        const voronoi = d3Voronoi.voronoi().extent([[x0 - 1, y0 - 1], [x1 + 1, y1 + 1]])(polygon);

        const edges = voronoi.edges.filter(edge => {
            if (edge && edge.right) {
                const inside = edge.map(point => d3.polygonContains(polygon, point));
                if (inside[0] === inside[1]) {
                    return inside[0];
                }
                if (inside[1]) {
                    edge.reverse();
                }
                return true;
            }
            return false;
        });

        edges.forEach(edge => {
            const [start, end] = edge;
            const {intersection, distance} = polygon.reduce((best, point, i) => {
                const intersection = findIntersection(start, end, point, polygon[i + 1] || polygon[0]);
                if (intersection) {
                    const distance = distanceBetween(start, intersection);
                    if (!best.distance || distance < best.distance) {
                        return {intersection, distance};
                    }
                }
                return best;
            }, {});
            if (intersection) {
                edge[1] = intersection;
                edge.distance = distance;
                edge[1].clipped = true;
            } else {
                edge.distance = distanceBetween(start, end);
            }
        });

        const nodes = [];

        edges.forEach(edge => {
            edge.forEach((node, i) => {
                if (!i || !node.clipped) {
                    const match = nodes.find(d => d === node);
                    if (match) {
                        return (node.id = match.id);
                    }
                }
                node.id = nodes.length.toString();
                node.links = {};
                nodes.push(node);
            });
            edge[0].links[edge[1].id] = edge.distance;
            edge[1].links[edge[0].id] = edge.distance;
        });
        const graph = new Graph();
        nodes.forEach(node => {
            graph.addNode(node.id, node.links);
        });
        const perimeterNodes = nodes.filter(d => d.clipped);
        const longestShortest = perimeterNodes.reduce((totalBest, start, i) => {
            const path = perimeterNodes.slice(i + 1).reduce((nodeBest, node) => {
                const path = graph.path(node.id, start.id, {cost: true});
                if (!nodeBest.cost || path.cost > nodeBest.cost) {
                    return path;
                }
                return nodeBest;
            }, {});

            if (!totalBest.cost || path.cost > totalBest.cost) {
                return path;
            }
            return totalBest;
        }, {});
        if (longestShortest.path) {
            let centerline = longestShortest.path.map(id => nodes[+id]);
            console.log(centerline);
            centerline = simplify(centerline.map(d => ({x: d[0], y: d[1]})), 3).map(d => [d.x, d.y]);

            const smoothLine = d3.line().curve(d3.curveBasis);
            return smoothLine(centerline);
        }
    }

}