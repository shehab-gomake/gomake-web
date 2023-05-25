import {
    IMachine,
    MinMaxValue, NumberHeightValue,
    WidthLengthValue
} from "@/widgets/machines/utils/interface/machine-attributes";

export interface IDigitalPrintingMachine extends IMachine{

    monthlyMaintenanceCost: number;
    electricityCostPerWorkingHour: number;
    dailyProductivityInHours: number;
    monthlyCostOfSpace: number
    lifeExpectancyYears: number;
    printLife: number;
    minManpowerOperation: number;
    setupTimeMin: number;
    resolution: string;
    minMediaDimensions: WidthLengthValue;
    maxMediaDimensions:  WidthLengthValue;
    minMarginWithoutPrinting: WidthLengthValue

    mediaWeight: MinMaxValue;
    mediaThickness: MinMaxValue;

    mediaCoatingUnit: {
        required: boolean;
        costForMeter: number
    };
    speedByColorsNumber: Record<number, number>;

    speedByPaperSizeByColorNumber: {
        colorNumber: number;
        media: WidthLengthValue;
        speed: number;
    };
    speedCoefficientByWeight: {weight: number, speedPercentage: number}[]
    feeders: NumberHeightValue[];
    stackers: NumberHeightValue[];
    insertOptions: boolean;
    printingSides: 1 | 2;
    doubleHeadPrinting: boolean;
    basicsColors: 'black' | 'CMYK';
    additionalColorsCount: number;
    additionalColors: {color: string; exists: boolean; coastPerCM2: number;}[];
    layers: {printLayers: boolean; printSameRun: boolean; max: number};
    coastBySizeColorsNumber: {colorsCount: number; mediaSize: WidthLengthValue; coast: number; currency: string }[]
}