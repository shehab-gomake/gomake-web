import {digitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {basicSettingResolution} from "@/widgets/machines/utils/attributes/basic-inputs/basic-setting-resolution";
import {generalPrintingSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-printing-settings";
import {laminationMachine} from "@/widgets/machines/utils/attributes/basic-inputs/lamination-machine";
import {manualPeelingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/manual-peeling-machine";
import {generalBookSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-book-settings";
import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const getCategoryBasicInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return basicSettingResolution(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return generalPrintingSettings(state);
        case ECategoryId.FLEXO_PRINTING:
            return generalPrintingSettings(state);
        case ECategoryId.ROLL_WIDE_PRINTING:
            return generalPrintingSettings(state);
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return generalPrintingSettings(state);
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachine(state);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return basicSettingResolution(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return basicSettingResolution(state);
        case ECategoryId.MANUAL_PEELING_STICKERS:
            return manualPeelingMachine(state);
        case ECategoryId.COLLECTOR:
            return basicSettingResolution(state);
        case ECategoryId.BOOKLET_MACHINE:
            return generalBookSettings(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return generalBookSettings(state);
        default:
            return generalBasicSettings(state);
    }
}

export {getCategoryBasicInputs};