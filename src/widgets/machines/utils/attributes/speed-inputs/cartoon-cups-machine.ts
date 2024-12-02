import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const cartoonCupsMachine = (state: Record<string, any>) => {
    return [
        ...maxSpeedInput(state, EMeasurementUnits.CUPS_PER_HOUR)
    ]
}

export {cartoonCupsMachine};