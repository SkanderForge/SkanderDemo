import {
    TMapmode,
    TMapmodeArgs,
    TProvinceTypes,
} from "@/utils/types/map";
import {
    defaultLayerStyle,
    defaultSecondLayerStyle,
    setStyle,
} from "@/utils/map/mapmodes";

const development: TMapmode = {
    key: "development",
    firstLayerStyleGenerator: (e: TMapmodeArgs) => {
        const {layer, settings, svg} = e;
        const style = {...defaultLayerStyle};
        let color = "#fff";
        const total = [
            parseInt(layer.data["base_tax"]),
            parseInt(layer.data["base_production"]),
            parseInt(layer.data["base_manpower"]),
        ].reduce((acc, curr) => acc + curr, 0);

        style.fillOpacity = "0.8";

        if (layer.provinceType === TProvinceTypes.SEAZONE) {
            color = "#46649d";
            style.fillOpacity = "0.5";
        }

        if (settings.enableOverlay) {
            style.fill = "#fff";
            svg
                .select("#layer1_sub")
                .append("circle")
                .attr("cx", layer.centroid[0])
                .attr("cy", layer.centroid[1])
                .attr("r", total)
                .attr("stroke", "none")
                .attr("fill", "rgba(25,204,25,0.1)");
        } else {
            if (!(total > 0)) {
                color = "#5E5E5E";
            } else if (total > 0 && total < 40) {
                const R = 255 - total * (255 / 40);
                const G = 255 - total * (128 / 40);
                const B = 255 - total * (255 / 40);
                color = `rgb(${R}, ${G}, ${B})`;
            }
            style.fill = color;
        }

        setStyle(layer, style);
    },
    secondLayerStyleGenerator: (e: TMapmodeArgs) => {
        const style = {...defaultSecondLayerStyle};
        style.strokeWidth = "1px";
        style.strokeOpacity = "1";
        setStyle(e.layer, style);
    },
};

export {development};