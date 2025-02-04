import {IInput, IMachineInputContainer} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {MachineMultiInput} from "@/widgets/machines/components/inputs/machine-multi-input";
import {FormArrayInput} from "@/components/form-inputs/form-array-input";
import {FormInput} from "@/components/form-inputs/form-input";
import {MachineMaterialInput} from "@/widgets/machines/components/inputs/machines-material-input";

const InputContainer = ({attribute, updateState, error, newValue, disableUpdateValues}: IMachineInputContainer) => {
    {
        switch (attribute.machineInputType) {
            case 'multiArrayInput':
                return <FormArrayInput newValue={newValue} name={attribute.name} parameterKey={attribute.parameterKey}
                                       value={attribute.value} inputs={attribute.inputs} updateState={updateState}
                                       isValid={!error} disableUpdateValues={!!disableUpdateValues} disabled={!!attribute?.disabled} disableAddValue={attribute?.disableAddValue}/>
            case 'multiInput':
                return <MachineMultiInput name={attribute.name} parameterKey={attribute.parameterKey}
                                          updateState={updateState}
                                          value={attribute.value}
                                          disabled={attribute.disabled}
                                          inputs={attribute.inputs} isValid/>
            case 'materialInput':
                return <MachineMaterialInput {...attribute}/>
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