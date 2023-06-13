import {IInput, IMachineInputContainer} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {MachineInput} from "@/widgets/machines/components/inputs/machine-inputs";
import {MachineMultiInput} from "@/widgets/machines/components/inputs/machine-multi-input";
import {MachineMultiArrayInput} from "@/widgets/machines/components/inputs/machine-multi-array-input";

const InputContainer = ({attribute, updateState, error}: IMachineInputContainer) => {
    {
        switch (attribute.machineInputType) {
            case 'multiArrayInput':
                return <MachineMultiArrayInput name={attribute.name} parameterKey={attribute.parameterKey} value={attribute.value} inputs={attribute.inputs} updateState={updateState} isValid={!error}/>
            case 'multiInput':
                return <MachineMultiInput name={attribute.name} parameterKey={attribute.parameterKey}
                                          updateState={updateState}
                                          value={attribute.value}
                                          inputs={attribute.inputs} isValid/>
            default:
                return <MachineInput
                    key={attribute.parameterKey}
                    input={attribute as IInput}
                    changeState={updateState}
                    error={error}
                />
        }
    }
}

export {InputContainer}