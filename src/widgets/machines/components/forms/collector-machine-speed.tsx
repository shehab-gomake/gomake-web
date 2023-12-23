import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {CollectorCellsMaxThickness} from "@/widgets/machines/components/forms/collector-cell-max-thickness-list";

const CollectorMachineSpeed = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineSpeedAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineSpeedAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
                <CollectorCellsMaxThickness controlled={false}/>
            </div>
        </div>
    );
}

export {
    CollectorMachineSpeed
};