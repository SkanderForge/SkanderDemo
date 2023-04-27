import {MapLayer} from "@/utils/map/mapLayer";
import {CSSProperties} from "react";

export enum TProvinceTypes {
    UNDEFINED,
    REGULAR,
    WASTELAND,
    UNCOLONIZED,
    SEAZONE,
    LAKEZONE,
}
// export type TLayerStyle =  {
//     fill?: string | number,
//     fillOpacity?: string | number,
//     stroke?: string | number,
//     strokeWidth?: string | number,
//     strokeDasharray?:string,
//     strokeOpacity?:string,
//     clipPath?:string,
//     paintOrder?:string,
//     filter?:string,
// }
export type TLayerStyle = Partial<CSSProperties>;

export interface TMapmodeArgs{
    layer:any,
    dataBanks:any,
    svg:any,
    settings:any,
    styleOverrides:any,
}
export type TMapmode = {
    key: string;
    firstLayerStyleGenerator?: (x:TMapmodeArgs) => void,
    secondLayerStyleGenerator?: (x:TMapmodeArgs) => void,
};
export type TMapmodes = {
    [key: string]: TMapmode
};