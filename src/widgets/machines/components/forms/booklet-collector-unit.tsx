import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {CollectorCellsMaxThickness} from "@/widgets/machines/components/forms/collector-cell-max-thickness-list";

const BookletCollectorUnit = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineFoldingAttributes, changeMachineAttributes, errors} = useMachineAttributes();

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineFoldingAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
                <CollectorCellsMaxThickness/>
            </div>
        </div>
    );
}

export {BookletCollectorUnit};