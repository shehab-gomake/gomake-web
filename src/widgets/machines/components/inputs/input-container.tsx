import {IInput, IMachineInputContainer} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {MachineMultiInput} from "@/widgets/machines/components/inputs/machine-multi-input";
import {FormArrayInput} from "@/components/form-inputs/form-array-input";
import {FormInput} from "@/components/form-inputs/form-input";

const InputContainer = ({attribute, updateState, error}: IMachineInputContainer) => {
    {
        switch (attribute.machineInputType) {
            case 'multiArrayInput':
                return <FormArrayInput name={attribute.name} parameterKey={attribute.parameterKey} value={attribute.value} inputs={attribute.inputs} updateState={updateState} isValid={!error}/>
            case 'multiInput':
                return <MachineMultiInput name={attribute.name} parameterKey={attribute.parameterKey}
                                          updateState={updateState}
                                          value={attribute.value}
                                          disabled={attribute.disabled}
                                          inputs={attribute.inputs} isValid/>
            default:
                return <FormInput
                    key={attribute.parameterKey}
                    input={attribute as IInput}
                    changeState={updateState}
                    error={error}
                />
        }
    }
}

export {InputContainer}