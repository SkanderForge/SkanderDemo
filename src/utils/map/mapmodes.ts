import {MapLayer} from "@/utils/map/mapLayer";
import {Config} from "@/config";
import {TLayerStyle, TMapmodeArgs, TMapmodes, TProvinceTypes} from "@/utils/types/types";
import {shadeColor} from "@/utils/shadeColor";

import * as map  from '@/utils/map/mapmodes/index'

console.log(map);

export const defaultLayerStyle: TLayerStyle = {
    fill: "none",
    fillOpacity: "1",
    stroke: "#000",
    strokeWidth: "1px",
    strokeOpacity: "0.3",
    strokeLinecap: "round",
}
export const defaultSecondLayerStyle: TLayerStyle = {
    strokeWidth: "3px",
    stroke: "#000",
    fill: "none",
    strokeLinecap: "round",
}

export function setStyle(layer: any, style: any) {
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
    ...map
}

export default mapmodes;