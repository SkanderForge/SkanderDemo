import {TMapmode, TMapmodeArgs, TProvinceTypes} from "@/utils/types/map";
import {defaultLayerStyle, defaultSecondLayerStyle, setStyle} from "@/utils/map/mapmodes";


const development: TMapmode = {
    key: "development",
    firstLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultLayerStyle};
        let color = "#fff";
        let total = parseInt(e.layer.data['base_tax']) + parseInt(e.layer.data['base_production']) + parseInt(e.layer.data['base_manpower']);

        style.fillOpacity = "0.8";

        if (e.layer.provinceType === TProvinceTypes.SEAZONE) {
            color = "#46649d";
            style.fillOpacity = "0.5";
        }
        if (e.settings.enableOverlay) {
            style.fill = "#fff";
            e.svg.select("#layer1_sub").append('circle')
                .attr('cx', e.layer.centroid[0])
                .attr('cy', e.layer.centroid[1])
                .attr('r', total)
                .attr('stroke', 'none')
                .attr('fill', 'rgba(25,204,25,0.1)');
            setStyle(e.layer, style);
        } else {
            if (!(total > 0)) {
                color = "#5E5E5E"
            } else if (total > 0 && total < 40) {
                const R = 255 - total * (255 / 40);
                const G = 255 - total * (128 / 40);
                const B = 255 - total * (255 / 40);
                color = "rgb(" + R + "," + G + "," + B + ")";
            }
            style.fill = color;
            setStyle(e.layer, style);
        }
    },
    secondLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultSecondLayerStyle};
        style.strokeWidth = "1px";
        style.strokeOpacity = "1";

        setStyle(e.layer, style);
    }
}
export {development};