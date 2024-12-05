import {useStyle} from "../style";
import {IStepFormProps} from "../interface";
import {InputContainer} from "../../inputs/input-container";
import {useMachineAttributes} from "../../../hooks/use-machine-attributes";
import {materialCategories} from "@/widgets/machines/components/forms/cnc-tools/material-categories";

const inputs = (state) => {
    return state.attributes?.isAvailableEngravingUnit ? [
        {
            name: "isAvailable",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "isAvailableEngravingUnit",
            options: [],
            value: state.attributes?.isAvailableEngravingUnit ? state.attributes?.isAvailableEngravingUnit : ''
        },
        ...materialCategories(state, 'engravingUnit')
    ] : [{
        name: "isAvailable",
        label: "machineAttributes.available",
        type: "switch",
        placeholder: "machineAttributes.available",
        required: true,
        parameterKey: "isAvailableEngravingUnit",
        options: [],
        value: state.attributes?.isAvailableEngravingUnit ? state.attributes?.isAvailableEngravingUnit : ''
    },];
}
const CNCEngravingUnitComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {
        machineState,
        changeMachineAttributes,
        errors,
    } = useMachineAttributes()
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    inputs(machineState).map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
            </div>

        </div>
    );
}

export {CNCEngravingUnitComponent};