import {TMapmode, TMapmodeArgs, TProvinceTypes} from "@/utils/types/map";
import {Config} from "@/config";
import {defaultLayerStyle, defaultSecondLayerStyle, setStyle} from "@/utils/map/mapmodes";


const casualties:TMapmode = {
    key: "casualties",
    firstLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultLayerStyle};
        switch (e.layer.provinceType) {
            case TProvinceTypes.SEAZONE:
                style.fill = Config.MapConfig.WaterzoneColor;
                (e.settings.bgVisible) ? style.fillOpacity = "0" : style.fillOpacity = "1";
                (e.settings.bgVisible) ? style.strokeWidth = "0" : style.strokeWidth = "0.3px";
                break;
            case TProvinceTypes.UNCOLONIZED:
                style.fill = Config.MapConfig.UncolonizedColor;
                (e.settings.bgVisible) ? style.fillOpacity = "0.3" : style.fillOpacity = "1";
                break;
            case TProvinceTypes.WASTELAND:
                style.fill = Config.MapConfig.WastelandColor;
                (e.settings.bgVisible) ? style.fillOpacity = "0.3" : style.fillOpacity = "1";
                break;
            case TProvinceTypes.REGULAR:
                style.fill = "#fff";
                (e.settings.bgVisible) ? style.fillOpacity = "0.8" : style.fillOpacity = "1";
                break;
        }

        let maxCasualties = e.dataBanks["saveData"]["additionalData"]["maxLandCasualties"] ?? 0;

        let base = Math.sqrt(1 + maxCasualties);
        let multiplier = 128 / base;
        let casualties = e.layer.data.casualties ?? 0;

        let r = (Math.round(Math.sqrt(casualties) * multiplier) / 1.1);
        if (e.settings.enableOverlay) {
            e.svg.select("#layer1_sub").append('circle')
                .attr('cx', e.layer.centroid[0])
                .attr('cy', e.layer.centroid[1])
                .attr('r', r)
                .attr('stroke', 'none')
                .attr('fill', 'rgba(252,28,28,0.1)');
        } else {
            if (e.layer.provinceType === TProvinceTypes.REGULAR) {
                let base = Math.sqrt(1 + maxCasualties);
                let multiplier = 128 / base;
                let r = 128 + (Math.round(Math.sqrt(casualties) * multiplier));
                let g = 128 - (Math.round(Math.sqrt(casualties) * multiplier));
                let b = 128 - (Math.round(Math.sqrt(casualties) * multiplier));
                style.fill = `rgb(${r},${g},${b})`;
            }
        }
        setStyle(e.layer, style);
    },
    secondLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultSecondLayerStyle};
        style.strokeWidth = "1px";
        style.strokeOpacity = "1";

        setStyle(e.layer, style);
    }
}
export {casualties};