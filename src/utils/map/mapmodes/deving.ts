import {TMapmode, TMapmodeArgs, TProvinceTypes} from "@/utils/types/map";
import {defaultLayerStyle, defaultSecondLayerStyle, setStyle} from "@/utils/map/mapmodes";

const deving: TMapmode = {
    key: "deving",
    firstLayerStyleGenerator: (args: TMapmodeArgs) => {
        const {layer, layer: {data, provinceType}, settings: {enableOverlay}, svg, dataBanks} = args;

        const style = {...defaultLayerStyle};
        let circleFill = "green";

        if (provinceType === TProvinceTypes.SEAZONE) {
            style.fill = "#46649d";
            style.fillOpacity = "0.5";
        }

        if (provinceType === TProvinceTypes.REGULAR) {
            style.fillOpacity = "1";
            circleFill = dataBanks.saveData[data.owner]?.hex ?? "green";
        }

        if (enableOverlay) {
            let underlyingPath = layer.node.getAttribute("d");
            if (layer.provinceType === TProvinceTypes.REGULAR) {
                svg.select("#layer1_sub").append('path')
                    .attr('d', underlyingPath)
                    .attr('fill', circleFill)
                    .attr("transform-origin", `${layer.centroid[0]} ${layer.centroid[1]}`)
                    .attr("transform-box", "fill-box")
                    .attr("transform", `scale(${Math.min(20, Math.max(0, parseInt(data.improveCount))) / 20})`)
                    .attr("fill-opacity", "0.5");
            }


            style.fill = "#fff";
            if (false) {
                svg.select("#layer1_sub").append('circle')
                    .attr('cx', layer.centroid[0])
                    .attr('cy', layer.centroid[1])
                    .attr('r', Math.max(0, parseInt(data.improveCount)) * 0.5)
                    .attr('stroke', 'none')
                    .attr('fill', circleFill)
                    .attr("fill-opacity", "0.33");
            }
            setStyle(layer, style);
        } else {
            const total = Math.max(0, parseInt(data.improveCount));
            let color = "";

            if (total === 0) {
                color = "#5E5E5E";
            } else if (total > 0 && total < 30) {
                const R = 255 - total * (255 / 20);
                const G = 255 - total * (128 / 20);
                const B = 255 - total * (255 / 20);
                color = `rgb(${R},${G},${B})`;
            } else {
                color = '#275b27';
            }

            style.fill = color;
            setStyle(layer, style);
        }
    },

    secondLayerStyleGenerator: (args: TMapmodeArgs) => {
        const style = {...defaultSecondLayerStyle, strokeWidth: "1px", strokeOpacity: "1"};
        setStyle(args.layer, style);
    }
};

export {deving};