import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const rollMachinesConnection = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToRollWidePrinting', ECategoryId.ROLL_WIDE_PRINTING, 'connectToRollWidePrinting'),
        ...connectionToMachine(state, 'connectToRollDigital', ECategoryId.ROLL_DIGITAL_PRINTING, 'connectToRollDigital'),
        ...connectionToMachine(state, 'connectToRollFedCutting', ECategoryId.ROLL_FED_CUTTING_PLOTTERS, 'connectToRollFedCutting'),
        ...connectionToMachine(state, 'connectToRollLaserCut', ECategoryId.ROLL_FINISH_MACHINE, 'connectToRollLaserCut'),
        ...connectionToMachine(state, 'connectToRollLamination', ECategoryId.ROLL_LAMINATION_MACHINE, 'connectToRollLamination'),
        ...connectionToMachine(state, 'connectToRollDieCut', ECategoryId.ROLL_DIE_CUT_MACHINE, 'connectToRollDieCut'),
        ...connectionToMachine(state, 'connectToRollSheeter', ECategoryId.ROLL_SHEET_MACHINE, 'connectToRollSheeter'),
        ...connectionToMachine(state, 'connectToRollVarnish', ECategoryId.ROLL_VARNISH_MACHINE, 'connectToRollVarnish'),
        ...connectionToMachine(state, 'connectToRollDigitalEnhancement', ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE, 'connectToRollDigitalEnhancement'),
        ...connectionToMachine(state, 'connectToRollAnalogEnhancement', ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE, 'connectToRollAnalogEnhancement'),
    ];
}

export {rollMachinesConnection};