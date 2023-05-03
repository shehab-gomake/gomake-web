import {IInput, IMachineInputContainer} from "@/widgets/admin-machines/interfaces/inputs-interfaces";
import {MachineInput} from "@/widgets/admin-machines/components/machine-inputs";
import {MachineMultiInput} from "@/widgets/admin-machines/components/machine-multi-input";
import {MachineMultiArrayInput} from "@/widgets/admin-machines/components/machine-multi-array-input";

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