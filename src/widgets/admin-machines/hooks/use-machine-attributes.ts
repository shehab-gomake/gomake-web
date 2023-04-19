import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/admin-machines/state/machine-state";
import {useState} from "react";
import {machineInputs} from "@/widgets/admin-machines/add-machine/inputs/machine-inputs/machine-inputs";
import {getCategoryBasicInputs} from "@/widgets/admin-machines/add-machine/inputs/basic-inputs";
import {getCategoryMediaInputs} from "@/widgets/admin-machines/add-machine/inputs/media-inputs";
import {getCategorySpeedInputs} from "@/widgets/admin-machines/add-machine/inputs/speed-inputs";
import {getCategoryFeedersStackersInputs} from "@/widgets/admin-machines/add-machine/inputs/feeders-stackers-inputs";
import {getCategoryColorsInputs} from "@/widgets/admin-machines/add-machine/inputs/colors-inputs";
import {getCategoryBeatsInputs} from "@/widgets/admin-machines/add-machine/inputs/beats-inputs";
import {getCategoryMachineDimensionsInputs} from "@/widgets/admin-machines/add-machine/inputs/machine-dimensions";

const useMachineAttributes = () => {
    const machineState = useRecoilValue(STATE);
    const setMachine = useSetRecoilState(STATE);
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const changeMachineGeneralAttributes = (key: string, value: any) => {
        setErrors({...errors, [key]: false});
        setMachine({...machineState, [key]: value});
    };

    const changeMachineAttributes = (key: string, value: any) => {
        setMachine({
            ...machineState,
            attributes: {
                ...machineState.attributes,
                [key]: value
            }
        })
    }

    const machineGeneralAttributes = machineInputs(machineState);
    const machineBasicAttributes = () => !!machineState.category ? getCategoryBasicInputs(machineState.category, machineState) : [];
    const machineMediaAttributes = () => !!machineState.category ? getCategoryMediaInputs(machineState.category, machineState) : [];
    const machineSpeedAttributes = () => getCategorySpeedInputs(machineState.category, machineState);
    const machineFeedersStackersAttributes = () => !!machineState.category ? getCategoryFeedersStackersInputs(machineState.category, machineState) : [];
    const machineColorsAttributes = () => !!machineState.category ? getCategoryColorsInputs(machineState.category, machineState) : [];
    const machineBeatsAttributes = () => !!machineState.category ? getCategoryBeatsInputs(machineState.category, machineState) : [];
    const machineDimensionsAttributes = () => !!machineState.category ? getCategoryMachineDimensionsInputs(machineState.category, machineState) : [];


    return {
        machineGeneralAttributes,
        machineBasicAttributes,
        machineMediaAttributes,
        machineSpeedAttributes,
        machineFeedersStackersAttributes,
        machineColorsAttributes,
        machineBeatsAttributes,
        machineDimensionsAttributes,
        changeMachineAttributes,
        changeMachineGeneralAttributes,
        errors
    };
}

export {useMachineAttributes};