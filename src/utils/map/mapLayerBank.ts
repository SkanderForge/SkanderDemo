import {MapLayer} from "@/utils/map/mapLayer";

export class MapLayerBank {
    private bank: any[];
    public first = () => {
        return this.bank[0] as Array<MapLayer>;
    }
    public second = () => {
        return this.bank[1] as Array<MapLayer>;
    }
    public getLayerBank = (level:number) => {
        console.log(this.bank[level-1]);
        return this.bank[level-1];
    }
    constructor() {
        this.bank = Array.from({length: 3}, () => []);
    }
    get(layer: number, identifier: string) {
        return this.bank[layer - 1].find((e: any) => {
            return e.id == identifier;
        })
    }
}