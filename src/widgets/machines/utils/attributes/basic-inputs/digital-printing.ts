import {generalPrintingSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-printing-settings";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        ...generalPrintingSettings(state),
    ];
}

export {digitalPrinting};