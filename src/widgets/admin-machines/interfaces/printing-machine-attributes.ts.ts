import {EBasicColors} from "../enums";
import {IMinMax} from "./max-min";
import {ISpeedColors, ISpeedColorsSize} from "./speed_colors";
import {IFeederStacker} from "./feeder_stackers";

export interface IPrintingMachineAttributes {
    monthlyMaintenanceCost: number;
    electricityCostPerWorkingHour: number;
    monthlyCostOfSpace: number;
    dailyProductivityInHours: number;
    lifeExpectancyYears: number;
    printLife: number;
    minManpowerOperation: number;
    resolution: string;
    printingSides: string;
    doubleHead: boolean;
    setupTimeMin: string
    minMediaDimensions: IMinMax;
    maxMediaDimensions: IMinMax;
    minMarginWithoutPrinting: IMinMax;
    mediaWeight: IMinMax;
    mediaThickness: IMinMax;
    coatingUnit: boolean;
    coatingUnitCost: string;
    speedByColor: ISpeedColors[] | ISpeedColorsSize[];
    feeder:IFeederStacker;
    stacker: IFeederStacker;
    insertOption: boolean;
    basicsColors: EBasicColors,
    additionalColorsAmount: number;
    printLayers: boolean;
    printLayersSameRun: boolean;
    printLayersMax: number;
}