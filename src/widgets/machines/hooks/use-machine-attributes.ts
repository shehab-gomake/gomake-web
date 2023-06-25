import {useRecoilValue, useSetRecoilState} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {useState} from "react";
import {machineInputs} from "@/widgets/machines/utils/attributes/machine-inputs/machine-inputs";
import {getCategoryBasicInputs} from "@/widgets/machines/utils/attributes/basic-inputs";
import {getCategoryMediaInputs} from "@/widgets/machines/utils/attributes/media-inputs";
import {getCategorySpeedOptionsInputs} from "@/widgets/machines/utils/attributes/speed-inputs/speed-options";
import {getCategoryFeedersStackersInputs} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs";
import {getCategoryColorsInputs} from "@/widgets/machines/utils/attributes/colors-inputs";
import {getCategoryBeatsInputs} from "@/widgets/machines/utils/attributes/beats-inputs";
import {getCategoryMachineDimensionsInputs} from "@/widgets/machines/utils/attributes/machine-dimensions";
import {getCategoryCoatingInputs} from "@/widgets/machines/utils/attributes/coating-inputs";
import {getCategoryPlateInputs} from "@/widgets/machines/utils/attributes/plate-inputs";
import {getCategoryBlanketCylinderInputs} from "@/widgets/machines/utils/attributes/blanket-cylinder-inputs";
import {getCategoryUnWinderInputs} from "@/widgets/machines/utils/attributes/unwinder-rewinder";
import {getCategoryFoldingInputs} from "@/widgets/machines/utils/attributes/run-inputs";
import {getCategoryConnectionInputs} from "@/widgets/machines/utils/attributes/connection-inputs";
import {getCategorySpeedInputs} from "@/widgets/machines/utils/attributes/speed-inputs";
import {getCategoryCuttingOptionsInputs} from "@/widgets/machines/utils/attributes/cutting-options-inputs";
import {getCategoryInputs} from "@/widgets/machines/utils/attributes/other-settings";
import {getCategoryStapleInputs} from "@/widgets/machines/utils/attributes/staple";


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
    const machineMultiOptionsSpeedAttributes = () => getCategorySpeedOptionsInputs(machineState.category, machineState);
    const machineFeedersStackersAttributes = () => !!machineState.category ? getCategoryFeedersStackersInputs(machineState.category, machineState) : [];
    const machineColorsAttributes = () => !!machineState.category ? getCategoryColorsInputs(machineState.category, machineState) : [];
    const machineBeatsAttributes = () => !!machineState.category ? getCategoryBeatsInputs(machineState.category, machineState) : [];
    const machineDimensionsAttributes = () => !!machineState.category ? getCategoryMachineDimensionsInputs(machineState.category, machineState) : [];
    const machineCoatingAttributes = () => !!machineState.category ? getCategoryCoatingInputs(machineState.category, machineState) : [];
    const machinePlateAttributes = () => !!machineState.category ? getCategoryPlateInputs(machineState.category, machineState) : [];
    const machineBlanketCylinderAttributes = () => !!machineState.category ? getCategoryBlanketCylinderInputs(machineState.category, machineState) : [];
    const machineUnWinderAttributes = () => !!machineState.category ? getCategoryUnWinderInputs(machineState.category, machineState) : [];
    const machineFoldingAttributes = () => !!machineState.category ? getCategoryFoldingInputs(machineState.category, machineState) : [];
    const machineConnectionAttributes = () => !!machineState.category ? getCategoryConnectionInputs(machineState.category, machineState) : [];
    const machineCuttingOptionsAttributes = () => !!machineState.category ? getCategoryCuttingOptionsInputs(machineState.category, machineState) : [];
    const machineOtherSettingsAttributes = () => !!machineState.category ? getCategoryInputs(machineState.category, machineState) : [];
    const machineStapleAttributes = () => !!machineState.category ? getCategoryStapleInputs(machineState.category, machineState) : [];

    return {
        machineGeneralAttributes,
        machineBasicAttributes,
        machineMediaAttributes,
        machineMultiOptionsSpeedAttributes,
        machineFeedersStackersAttributes,
        machineColorsAttributes,
        machineBeatsAttributes,
        machineDimensionsAttributes,
        machineCoatingAttributes,
        machinePlateAttributes,
        machineBlanketCylinderAttributes,
        machineUnWinderAttributes,
        machineFoldingAttributes,
        machineConnectionAttributes,
        machineSpeedAttributes,
        machineStapleAttributes,
        machineAvenueAttributes: machineOtherSettingsAttributes,
        machineCuttingOptionsAttributes,
        changeMachineAttributes,
        changeMachineGeneralAttributes,
        errors,
        isValidStep
    };
}

export {useMachineAttributes};