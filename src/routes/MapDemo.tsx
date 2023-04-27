import React, {ChangeEvent, memo, MouseEventHandler, useCallback, useEffect, useRef} from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import {GeoJSON, GeoJsonProperties, Geometry} from "geojson";
import {fetchJson} from "@/utils/fetchJson";
import {Map} from "@/utils/map/map";
import {useAppDispatch} from "@/utils/store/customHooks";
import {hideLoader, setStatus, showLoader} from "@/utils/store/loaderSlice";
import {Box, Button, Grid, GridItem, Stack, Switch, useColorModeValue} from "@chakra-ui/react";

const MapDemo: React.FC = () => {


    const dispatch = useAppDispatch();


    const svgRef: React.RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);


    let saveId: string = "071716"//= "04b3db"; //= "8a33cd";

    const MR = useRef<Map>();

    const loadAndRender = useCallback(async () => {
        dispatch(showLoader("#skanderMap"));
        const svg = d3.select(svgRef.current);
        const M = new Map(svgRef);
        MR.current = M;
        dispatch(setStatus("Loading provinces color data..."));
        const provincesColors: {
            [key: string]: { id: string }
        } = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=provinces.data`);
        dispatch(setStatus("Loading save data..."));
        const saveData: any = await fetchJson(`https://skanderbeg.pm/doser.php?mapdata=true&file=${saveId}`);
        M._setDataBank("saveData", saveData);
        dispatch(setStatus("Loading language data..."));
        const languageData: any = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=language.data`);
        const provincesShapes: GeoJSON.FeatureCollection = await fetchJson(`https://skanderbeg.pm/api.php?scope=getGameFile&id=${saveId}&key=provinces.js`);
        dispatch(setStatus("Initializing the map & basic shapes..."));

        provincesShapes.features.map(function (element: GeoJSON.Feature<Geometry, GeoJsonProperties>) {
            if (element.properties) element.properties.id = parseInt(provincesColors[element.properties?.hex].id);
            return element;
        });
        M.initializeSvg(provincesShapes);
        svg.select("g").append("g").attr("id", "province-labels");
        dispatch(setStatus("Rendering provinces..."));
        dispatch(setStatus("Rendering macro provinces..."));
        M.executeMapmode("political");


        // let tagNames = Object.keys(saveData);
        // for (const tagName of tagNames) {
        //     if (!saveData[tagName]['hex']) continue;
        //     if (typeof saveData[tagName]['total_development'] == "undefined") continue;
        //     svg.select("#main_map").append("path")
        //         .attr("id", tagName)
        //         // @ts-ignore
        //         .datum(topojson.merge(M.topoJson, M.topoJson.objects.provincesShapes.geometries.filter(function (d: any): boolean {
        //             if (!saveData[d.properties.id]) return false;
        //             d.properties.owner = saveData[d.properties.id]['owner']
        //             return saveData[d.properties.id]['owner'] === tagName
        //         })))
        //         .attr("class", "bigArea")
        //         .attr("d", M.path as unknown as string)
        //         .style("stroke", "#000000")
        //         .style("fill-opacity", "0.85")
        //         .style("stroke-width", "1.5px")
        //         .attr("pointer-events", "none")
        //         .style("fill", function () {
        //           //  return saveData[tagName]['hex']
        //         });
        // }


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

    const toggleDisplayBackground = (event: ChangeEvent<HTMLInputElement>) => {
        MR.current?.toggleDisplayBackground();
    };

    const toggleMapmode = (event: any) => {
        MR.current?.executeMapmode(event.target.value);
    };

    const toggleLayerBorders = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        console.log(MR.current);
        MR.current?.toggleLayerBorderVisibility(Number(event.target.value));
    };
    const toggleHeatmapPreference = (event: any) => {
        MR.current?.toggleHeatmapPreference(event.target.checked)
    };

    useEffect(() => {
        loadAndRender();
    });


    const uiStyle = {
        padding: "15px",
        borderRadius: "0px 0px 25px 0px",
    }
    console.log(uiStyle);

    //We don't want the map to be re-rendered when switching the theme.
    const SkanderMap = memo(() => {
        return (
            <>
                <Box id={"skanderMap"} style={{position: "relative"}}>
                    <svg style={{marginTop: "0%"}} ref={svgRef}>
                        <g id={"main_map"}>
                            <g id={"layer0"}></g>
                            <g id={"layer1"}></g>
                            <g id={"layer1_sub"}></g>
                            <g id={"layer2"}></g>
                            <g id={"layer3"}></g>
                        </g>
                    </svg>
                    <Box id={"uiTopLeft"} backgroundColor={useColorModeValue("light.800", "dark.800")}
                         style={{position: "absolute", top: "0%", left: "0%", ...uiStyle}}>
                        <Grid>
                            <Stack justifyContent={"space-between"} direction={"row"}>
                                <GridItem><Box>Toggle background</Box></GridItem>
                                <GridItem><Switch defaultChecked={true} onChange={toggleDisplayBackground}/></GridItem>
                            </Stack>
                            <Stack justifyContent={"space-between"} direction={"row"}>
                                <GridItem><Box>Toggle province borders</Box></GridItem>
                                <GridItem><Switch defaultChecked={true} value={1}
                                                  onChange={toggleLayerBorders}/></GridItem>
                            </Stack>
                            <Stack justifyContent={"space-between"} direction={"row"}>
                                <GridItem><Box>Toggle country borders</Box></GridItem>
                                <GridItem pb={6}><Switch defaultChecked={true} value={2} onChange={toggleLayerBorders}/></GridItem>
                            </Stack>
                            <Stack justifyContent={"space-between"} direction={"row"}>
                                <GridItem><Box>Prefer heatmaps</Box></GridItem>
                                <GridItem pb={6}><Switch defaultChecked={true} value={2}
                                                         onChange={toggleHeatmapPreference}/></GridItem>
                            </Stack>
                            <GridItem>Mapmodes:</GridItem>
                            <GridItem>
                                <Stack
                                    justifyContent={"space-between"}
                                    direction={"row"}>
                                    <Button value={"political"} onClick={toggleMapmode}>P</Button>
                                    <Button value={"development"} onClick={toggleMapmode}>D</Button>
                                    <Button value={"casualties"} onClick={toggleMapmode}>C</Button>
                                </Stack>
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
            </>
        )
    });
    return (
        <SkanderMap/>
    )


        ;
};
export default MapDemo;