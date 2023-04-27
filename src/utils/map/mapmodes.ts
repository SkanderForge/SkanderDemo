import {MapLayer} from "@/utils/map/mapLayer";
import {Config} from "@/config";
import {TLayerStyle, TMapmodeArgs, TMapmodes, TProvinceTypes} from "@/utils/types/types";
import {shadeColor} from "@/utils/shadeColor";

const defaultLayerStyle: TLayerStyle = {
    fill: "none",
    fillOpacity: "1",
    stroke: "#000",
    strokeWidth: "1px",
    strokeOpacity: "0.3",
    strokeLinecap: "round",
}
const defaultSecondLayerStyle: TLayerStyle = {
    strokeWidth: "3px",
    stroke: "#000",
    fill: "none",
    strokeLinecap: "round",
}

function setStyle(layer: any, style: any) {
    layer.node.setAttribute('style', '');

    for (let command of Object.entries(style)) {
        // @ts-ignore
       // layer.node.style[command[0]] = `AA${command[1]}`;
        layer.node.style[command[0]] = `var(--${command[0]},${command[1]})`;
      //  layer.defaultStyle[command[0]] = command[1];
    }
}


export function cleanLayer(level: number, layer: any) {
    if (level === 1) {
        //setStyle(layer, defaultLayerStyle);
    }
    if (level === 2) {
        //setStyle(layer, defaultSecondLayerStyle);
    }
}

const mapmodes: TMapmodes = {
    "political": {
        key: "political",
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
                    style.fill = e.dataBanks['saveData'][e.layer.data.owner]['hex'];
                    (e.settings.bgVisible) ? style.fillOpacity = "0.8" : style.fillOpacity = "1";
                    break;
            }
            setStyle(e.layer, style);
        }
    },
    "development": {
        key: "development",
        firstLayerStyleGenerator: (e: TMapmodeArgs) => {
            let style = {...defaultLayerStyle};
            let color = "#fff";
            let total = parseInt(e.layer.data['base_tax']) + parseInt(e.layer.data['base_production']) + parseInt(e.layer.data['base_manpower']);
            if (!(total > 0)) {
                color = "#5E5E5E"
            } else if (total > 0 && total < 40) {
                const R = 255 - total * (255 / 40);
                const G = 255 - total * (128 / 40);
                const B = 255 - total * (255 / 40);
                color = "rgb(" + R + "," + G + "," + B + ")";
            }
            style.fillOpacity = "0.8";
            if (e.layer.provinceType === TProvinceTypes.SEAZONE) {
                color = "#46649d";
                style.fillOpacity = "0.5";
            }
            color = "#fff";
            style.fill = color;
            setStyle(e.layer, style);
        },
        secondLayerStyleGenerator: (e: TMapmodeArgs) => {
            let style = {...defaultSecondLayerStyle};
            style.strokeWidth = "1px";
            style.strokeOpacity = "1";

            setStyle(e.layer, style);
        }
    },
    "casualties": {
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

            let r = (Math.round(Math.sqrt(casualties) * multiplier));

            if(e.settings.preferHeatmaps) {
                e.svg.select("#layer1_sub").append('circle')
                    .attr('cx', e.layer.centroid[0])
                    .attr('cy', e.layer.centroid[1])
                    .attr('r', r)
                    .attr('stroke', 'none')
                    .attr('fill', 'rgba(175,54,54,0.2)');
            }else{
                if(e.layer.provinceType === TProvinceTypes.REGULAR){
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
    }
}


export default mapmodes;