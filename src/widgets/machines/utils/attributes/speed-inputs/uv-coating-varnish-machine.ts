import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {printingGeneral} from "@/widgets/machines/utils/attributes/speed-inputs/printing-general";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const uvCoatingVarnishMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.METER_P_MIN),
        ...printingGeneral(state, EMeasurementUnits.METER_P_MIN).filter(a => a.parameterKey !== 'speedByColorBySize' && a.parameterKey !== 'speedByPaperSizeByColor' && a.parameterKey !== 'speedByColor'),
        ]
}


export {uvCoatingVarnishMachine};


