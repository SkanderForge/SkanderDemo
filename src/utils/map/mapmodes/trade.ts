import {TMapmode, TMapmodeArgs, TProvinceTypes} from "@/utils/types/map";
import {defaultLayerStyle, defaultSecondLayerStyle, setStyle} from "@/utils/map/mapmodes";
import * as d3 from "d3";

const trade: TMapmode = {
    key: "trade",
    firstLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultLayerStyle};

        let color = "#fff";
        let node = e.dataBanks.saveData[e.layer.id]['tradenode'] ?? false;
        if (!node || e.layer.provinceType === TProvinceTypes.SEAZONE) {
            style.fill = "#fff";
            setStyle(e.layer, style);
            style.fillOpacity = "0.3";
        }
        if (node && e.layer.provinceType !== TProvinceTypes.SEAZONE) {
            let nodeData = e.dataBanks['saveData']['tradenodes'][node];
            let colorData = nodeData['color'] ?? e.dataBanks['regionColors'][nodeData.id + 1];
            if (!colorData) {
                color = e.dataBanks['regionColors'][nodeData.id + 2];
            } else {
                color = `rgb(${colorData[0]},${colorData[1]},${colorData[2]})`;
            }
            style.fillOpacity = "1";
        }
        style.fill = color;
        if (e.settings.enableOverlay) {
            const curve = d3.line().curve(d3.curveBasis);

            if (e.layer.data['trade_node_host']) {
                let tradeNode = e.layer.data['trade_node_host'];
                let tradeNodeData = e.dataBanks['saveData']['tradenodes'][tradeNode];
                let nodeRadius = Math.max(3, Number(Math.sqrt(Math.ceil(tradeNodeData.current_value ?? 0)) * 3));

                e.svg.select("#layer3_sub").append('circle')
                    .attr('cx', e.layer.centroid[0])
                    .attr('cy', e.layer.centroid[1])
                    .attr("id", `nodecircle-${tradeNodeData['name']}`)
                    .attr('r', nodeRadius)
                    .attr('stroke', '#000')
                    .attr('fill', 'rgb(44,173,44)');

                if (tradeNodeData.outgoing_connections) {
                    Object.entries(tradeNodeData.outgoing_connections).forEach((v: any) => {
                        if (!v[1].control) return;

                        //Add the starting province(trade node's host) to the set.
                        let initial = [e.layer.centroid[0], e.layer.centroid[1]];
                        //Add the finishing province(trade node's host) to the set.
                        let finishingPoint = e.caller.layerBank.get(1, e.dataBanks['saveData']['tradenodes'][v[0]]['location']);
                        let final = [finishingPoint.centroid[0], finishingPoint.centroid[1]];
                        //We need to detect if the trade flow line wraps around the map. If it does, we artificially add a final new point
                        //at the end of the map, which will serve as a starting point for a new line on the other side of the map.
                        let x, y, lineIndex: number = 0;
                        let lines: any = [];
                        lines.push([]);
                        lines[0].push(initial);
                        for (let i = 0; i < v[1].control.length; i += 2) {
                            if (Math.abs(x - v[1].control[i]) > 1000) {
                                let startingPoint, endingPoint: number[];
                                if (x < v[1].control[i]) {
                                    endingPoint = [0, 2048 - v[1].control[i + 1]]
                                    startingPoint = [5632, 2048 - v[1].control[i + 1]];
                                } else {
                                    endingPoint = [5632, 2048 - v[1].control[i + 1]]
                                    startingPoint = [0, 2048 - v[1].control[i + 1]];
                                }
                                lines[lineIndex].push(endingPoint);
                                lineIndex++;
                                lines.push([]);
                                lines[lineIndex].push(startingPoint);
                            }
                            x = v[1].control[i];
                            y = 2048 - v[1].control[i + 1];
                            lines[lineIndex].push([v[1].control[i], 2048 - v[1].control[i + 1]]);
                        }

                        lines[lines.length - 1].push(final);

                        let lineKey = `${tradeNodeData.name}-${v[0]}`;
                        let baselineWidth = 2.5;
                        let combinedWidth = ((parseFloat(v[1].value_total + v[1].added)) / 2);
                        let valueWidth = v[1].value_total / 3;
                        lines.forEach((l: any) => {
                            // @ts-ignore
                            const pathData = curve(l);
                            //Baseline that will show up even if there's no ongoing trade flow.
                            e.svg.select("#layer2_sub").append('path')
                                .attr('d', pathData)
                                .style("fill", "none")
                                .attr("stroke-width", baselineWidth)
                                .attr('stroke', '#c28a24')
                                .attr("stroke-linecap", "round")
                                .attr("id", `${lineKey}-baseline`)
                            //Line combining the entire size of the flow. Only the blue sides(the added value) are meant to show up
                            e.svg.select("#layer2_sub").append('path')
                                .attr('d', pathData)
                                // .style("display","none")
                                .style("fill", "none")
                                .attr("stroke-width", combinedWidth)
                                .attr('stroke', "#2315a2")
                                .attr("stroke-linecap", "round")
                                .attr("id", `${lineKey}-combined`)
                            //Just the 'basic' value flow
                            e.svg.select("#layer2_sub").append('path')
                                .attr('d', pathData)
                                //   .style("display","none")
                                .style("fill", "none")
                                .attr("stroke-width", valueWidth)
                                .attr('stroke', 'rgb(15,140,110)')
                                .attr("id", `${lineKey}-value`)
                                .attr("stroke-linecap", "round")
                                .attr("marker-mid", `url(#${lineKey}-arrow)`);
                        })

                    })
                }
            }
            setStyle(e.layer, style);
        } else {
            setStyle(e.layer, style);
        }
    },
    secondLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultSecondLayerStyle};
        style.strokeWidth = "1.3px";
        style.strokeOpacity = "1";
        setStyle(e.layer, style);
    }
}
export {trade};