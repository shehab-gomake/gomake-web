import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {useRecoilValue} from "recoil";
import {userState} from "@/store";
import {UNIT_TYPE} from "@/enums";

const deviceMakingMachine = (state: Record<string, any>) => {
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            //unit: EMeasurementUnits.PPM,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: "speedUnit",
            label: "machineAttributes.speedUnit",
            type: "select",
            placeholder: "machineAttributes.speedUnit",
            required: true,
            parameterKey: "speedUnit",
            value: state.attributes?.speedUnit,
            options: [{value: 'upm', text: 'Unit per min'}, {value: 'mpm', text: unitType === UNIT_TYPE.UNITS ? 'Meter per min' : 'Yard per min'}],
            machineInputType: 'input',
            isValid: true,
            disabled: state.attributes?.isManual
        },
    ]
}

export {deviceMakingMachine};

