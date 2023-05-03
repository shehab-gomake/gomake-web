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
import {getCategoryCoatingInputs} from "@/widgets/admin-machines/add-machine/inputs/coating-inputs";
import {getCategoryPlateInputs} from "@/widgets/admin-machines/add-machine/inputs/plate-inputs";
import {getCategoryBlanketCylinderInputs} from "@/widgets/admin-machines/add-machine/inputs/blanket-cylinder-inputs";


const useMachineAttributes = () => {
    const machineState = useRecoilValue(STATE);
    const setMachine = useSetRecoilState(STATE);
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const changeMachineGeneralAttributes = (key: string, value: any) => {
        setErrors({...errors, [key]: false});
        setMachine({...machineState, [key]: value});
    };

    const changeMachineAttributes = (key: string, value: any) => {
        setErrors({...errors, [key]: false});
        setMachine({
            ...machineState,
            attributes: {
                ...machineState.attributes,
                [key]: value
            }
        })
    }

    const isValidStep = (attributes: {isValid: boolean; parameterKey: string;}[]): boolean => {
        if (attributes.every(a => a.isValid)) {
            return true;
        } else {
            const stepErrors: Record<string, boolean> = {};
            attributes.forEach(attribute => {
                if (!attribute.isValid) {
                    stepErrors[attribute.parameterKey] = true;
                }
            });
            setErrors({...errors, ...stepErrors});
            return false;
        }
    }

    const machineGeneralAttributes = machineInputs(machineState);
    const machineBasicAttributes = () => !!machineState.category ? getCategoryBasicInputs(machineState.category, machineState) : [];
    const machineMediaAttributes = () => !!machineState.category ? getCategoryMediaInputs(machineState.category, machineState) : [];
    const machineSpeedAttributes = () => getCategorySpeedInputs(machineState.category, machineState);
    const machineFeedersStackersAttributes = () => !!machineState.category ? getCategoryFeedersStackersInputs(machineState.category, machineState) : [];
    const machineColorsAttributes = () => !!machineState.category ? getCategoryColorsInputs(machineState.category, machineState) : [];
    const machineBeatsAttributes = () => !!machineState.category ? getCategoryBeatsInputs(machineState.category, machineState) : [];
    const machineDimensionsAttributes = () => !!machineState.category ? getCategoryMachineDimensionsInputs(machineState.category, machineState) : [];
    const machineCoatingAttributes = () => !!machineState.category ? getCategoryCoatingInputs(machineState.category, machineState) : [];
    const machinePlateAttributes = () => !!machineState.category ? getCategoryPlateInputs(machineState.category, machineState) : [];
    const machineBlanketCylinderAttributes = () => !!machineState.category ? getCategoryBlanketCylinderInputs(machineState.category, machineState) : [];

    return {
        machineGeneralAttributes,
        machineBasicAttributes,
        machineMediaAttributes,
        machineSpeedAttributes,
        machineFeedersStackersAttributes,
        machineColorsAttributes,
        machineBeatsAttributes,
        machineDimensionsAttributes,
        machineCoatingAttributes,
        machinePlateAttributes,
        machineBlanketCylinderAttributes,
        changeMachineAttributes,
        changeMachineGeneralAttributes,
        errors,
        isValidStep
    };
}

export {useMachineAttributes};