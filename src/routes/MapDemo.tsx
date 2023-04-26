import React, {useCallback, useEffect, useRef} from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import {GeoJSON, GeoJsonProperties, Geometry} from "geojson";
import {fetchJson} from "@/utils/fetchJson";
import {Map} from "@/utils/map/map";
import {useAppDispatch} from "@/utils/store/customHooks";
import {hideLoader, setStatus, showLoader} from "@/utils/store/loaderSlice";
import {Box} from "@chakra-ui/react";

interface D3SVGElement extends SVGElement {
    __data__: {
        coordinates?: any
    }
    d?: SVGPathElement | string
}


const MapDemo: React.FC = () => {


    const dispatch = useAppDispatch();


    const svgRef = useRef<SVGSVGElement>(null);
    let test = useRef("Downloading...");
    let saveId = "1d6ea5"//= "04b3db"; //= "8a33cd";
    const loadAndRender = useCallback(async () => {
        dispatch(showLoader("#skanderMap"));
        let statusHolder = document.getElementById("loader_text") as HTMLElement;
        console.log(statusHolder);

        dispatch(setStatus("Loading provinces color data..."));
        const provincesColors: {
            [key: string]: { id: string }
        } = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=provinces.data`);
        dispatch(setStatus("Loading save data..."));
        const saveData: any = await fetchJson(`https://skanderbeg.pm/doser.php?mapdata=true&file=${saveId}`);
        dispatch(setStatus("Loading language data..."));
        const languageData: any = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=language.data`);
        const provincesShapes: GeoJSON.FeatureCollection = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=provinces.js`);
        dispatch(setStatus("Initializing the map & basic shapes..."));

        provincesShapes.features.map(function (element: GeoJSON.Feature<Geometry, GeoJsonProperties>) {
            if (element.properties) element.properties.id = parseInt(provincesColors[element.properties?.hex].id);
            return element;
        });
        const svg = d3.select(svgRef.current);
        const M = new Map(svgRef);
        M.initializeSvg(provincesShapes);
        const features = provincesShapes.features;
        svg.select("g").append("g").attr("id", "province-labels");
        dispatch(setStatus("Rendering provinces..."));

        svg.select("#province_shapes").selectAll("path")
            .data(features)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", M.path as unknown as string)
            .style("stroke", "#000")
            .style("stroke-opacity", function (d: any): number {
                if (!saveData[d.properties.id]) return 0;

                if (saveData[d.properties?.id]['owner'] === "SEAZONE") {
                    return 0;
                }
                if (!saveData[d.properties?.id]['owner']) {
                    return 0;
                }
                return 0.3;
            })
            .on("click", e => {
                console.log(e);
            })
            .style("fill-opacity", "0")
            .style("fill", function (d: any): string {
                let hex: string = "#5E5E5E";
                let id: number = parseInt(d.properties.id);
                this.id = "PROV_" + id.toString();
                if (!saveData[id]) return hex;
                if (!saveData[id]['owner']) return hex;

                if (saveData[saveData[id]['owner']]) {
                    hex = saveData[saveData[id]['owner']]['hex'];
                }
                if (saveData[id]['owner'] === "SEAZONE") {
                    hex = "#446BA3FF"
                }
                return hex
            });
        dispatch(setStatus("Rendering macro provinces..."));

        let tagNames = Object.keys(saveData);
        for (const tagName of tagNames) {
            if (!saveData[tagName]['hex']) continue;
            if (typeof saveData[tagName]['total_development'] == "undefined") continue;
            svg.select("#province_shapes").append("path")
                .attr("id", tagName)
                // @ts-ignore
                .datum(topojson.merge(M.topoJson, M.topoJson.objects.provincesShapes.geometries.filter(function (d: any): boolean {
                    if (!saveData[d.properties.id]) return false;
                    d.properties.owner = saveData[d.properties.id]['owner']
                    return saveData[d.properties.id]['owner'] === tagName
                })))
                .attr("class", "bigArea")
                .attr("d", M.path as unknown as string)
                .style("stroke", "#000000")
                .style("fill-opacity", "0.85")
                .style("stroke-width", "1.5px")
                .attr("pointer-events", "none")
                .style("fill", function () {
                    return saveData[tagName]['hex']
                });
            svg.select("#province_shapes")
                .append("text")
                .attr("dominant-baseline", "middle")
                .append("textPath")
                .attr("startOffset", "50%")
                .attr("text-anchor", "middle")
                .attr("id", `${tagName}_label_textPath`)
                .text(languageData[tagName]);
            svg.select(`#${tagName}_label_textPath`).attr("xlink:href", `#SHAPE_${tagName}`);
        }
// Loop through all area elements in the SVG
//             for (const areaNode of svg.selectAll(".bigArea").nodes()) {
//                 // Check if the area node exists and has an id
//                 if (!areaNode || !("id" in areaNode)) continue;
//
//                 console.log(areaNode.id);
//
//                 // Get the area element from the SVG
//                 let areaElement: D3SVGElement = svg.select(`#${areaNode.id}`).node() as D3SVGElement;
//
//                 // Check if the area element exists and has multiple coordinates
//                 if (areaElement?.__data__?.coordinates?.length > 1) {
//                     // Generate the centerline path and add it to the SVG
//                     let centerlinePath: string = await mapCenterlineGenerator(areaElement) as string;
//
//                     if (centerlinePath) {
//                         svg.select("g").append("path")
//                             .attr("id", `SHAPE_${areaNode.id}`)
//                             .attr("d", centerlinePath)
//                             .style("fill", "none");
//
//                         // Set font size based on the length of the path
//                         //TODO export this constant to a config file.
//                         let length: number = (svg.select(`#SHAPE_${areaNode.id}`).node() as SVGPathElement).getTotalLength();
//                         svg.select(`#${areaNode.id}_label_textPath`).style("font-size", `${Math.round(length) / 7}px`);
//
//                         //We sort the path by the X axis, to make sure that the text always goes left-to-right.
//                         //There's probably a much smarter way to do it, but unfortunately I don't know JS much D:
//                         //~~Apparently the svg-polyfill we use doesn't like setting attributes much. Uncomment this line
//                         //for some P A I N and M I S E R Y
//                         ////areaElement.setAttribute("d", sortPathByX(areaElement));
//                         console.log(document.getElementById(areaElement.id)?.getAttribute("d"));
//                         areaElement.setAttribute("d",sortPathByX(centerlinePath));
//                         (document.getElementById(areaElement.id) as any).d = areaElement;
//
//                     } else {
//                         console.error("Error in generating centerline path for", areaNode.id);
//                         console.info("Have you tried watching more anime?");
//                     }
//                 }
//             }
        dispatch(hideLoader());
    }, [dispatch, saveId]);
    useEffect(() => {
        loadAndRender();
    });

    return (
        <>
            <Box id={"skanderMap"} style={{position: "relative"}}>
                <svg style={{marginTop: "0%"}} ref={svgRef}>
                </svg>
            </Box>
        </>
    );
};
export default MapDemo;