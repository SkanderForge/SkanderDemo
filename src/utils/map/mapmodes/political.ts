import {TMapmode, TMapmodeArgs, TProvinceTypes} from "@/utils/types/map";
import {Config} from "@/config";
import {defaultLayerStyle, setStyle} from "@/utils/map/mapmodes";

const political: TMapmode = {
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
    },
    secondLayerStyleGenerator: (e: TMapmodeArgs) => {
        let style = {...defaultLayerStyle};
        if (e.dataBanks.saveData[e.layer.id]['hex']) {
            style.fill = e.dataBanks.saveData[e.layer.id]['hex'];
            style.fillOpacity = e.settings.bgVisible ? "0.1" : "0.5";
            style.fillOpacity = e.settings.pBordersVisible ? "0" : style.fillOpacity;
        }
        setStyle(e.layer, style);
    }
}

export {political};

