import {TProvinceTypes} from "@/utils/types/types";

interface layerOptions {
    id: string | number,
    type: string,
    dataBanks: any,
    provinceType?: string,
    centroid?:[number,number];
}

/**
 * MapLayer represents an individual
 * shape on the map. It can be both
 * a low-lvl shape(ie. a first level-layer)
 * or a higher-one, like a country's borders.
 *
 * Currently rendered MapLayers are stored in a
 * MapLayerBank, which are used for mapmode processing.
 */
export class MapLayer {
    public id: any;
    private type: any;
    data: any;
    cache: any;
    node: HTMLElement;
    provinceType: TProvinceTypes;
    defaultStyle:any;
    centroid:any;
    constructor(options: layerOptions) {
        this.id = options.id;
        this.type = options.type;
        this.provinceType = TProvinceTypes.UNDEFINED;
        this.centroid = options.centroid;
        this.node = document.getElementById(this.id) as HTMLElement;

        this.defaultStyle = this.node.style;
        if (!options.dataBanks['saveData']) return;
        this.data = options.dataBanks['saveData'][this.id];
        this.cache = [];


        if (this.data.owner === "SEAZONE") this.provinceType = TProvinceTypes.SEAZONE;
        if (!this.data.owner) this.provinceType = TProvinceTypes.WASTELAND;
        if (this.data["base_tax"] && !this.data.owner) this.provinceType = TProvinceTypes.UNCOLONIZED;
        if (this.data.owner && this.data.owner !== "SEAZONE") this.provinceType = TProvinceTypes.REGULAR;

    }
}