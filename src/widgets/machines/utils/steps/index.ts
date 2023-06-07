import {printingMachineSteps} from "@/widgets/machines/utils/steps/digital-printing-steps";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {ofssetPrintingSteps} from "@/widgets/machines/utils/steps/ofsset-printing-steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {rollDigitalPrintingSteps} from "@/widgets/machines/utils/steps/roll-digital-printing-steps";
import {flexoPrintingMachineSteps} from "@/widgets/machines/utils/steps/flexo-printing-steps";
import {rollWidePrintingMachineSteps} from "@/widgets/machines/utils/steps/roll-wide-printing-steps";
import {flatbedWidePrintingMachineSteps} from "@/widgets/machines/utils/steps/flatbed-wide-printing-steps";
import {laminationMachineSteps} from "@/widgets/machines/utils/steps/lamination-machine-steps";
import {roundingCornersMachineSteps} from "@/widgets/machines/utils/steps/rounding-corners-machine-steps";

const getSteps = (categoryId: ECategoryId): IStep[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return printingMachineSteps;
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrintingSteps;
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrintingSteps;
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrintingMachineSteps;
        case ECategoryId.ROLL_WIDE_PRINTING:
            return rollWidePrintingMachineSteps;
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return flatbedWidePrintingMachineSteps;
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachineSteps;
        case ECategoryId.PUNCHING_MACHINE:
            return printingMachineSteps;
        case ECategoryId.ROUNDING_CORNERS_MACHINE:
            return roundingCornersMachineSteps;
        default:
            return []
    }
}

export {getSteps};