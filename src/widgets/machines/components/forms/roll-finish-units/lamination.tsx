import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const inputs = (state) => {
    return [
        {
            name: 'machineAttributes.laminationUnit',
            parameterKey: 'laminationUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.laminationUnit ? state.attributes?.laminationUnit : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.isAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.isAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.laminationUnit?.isAvailable ? state.attributes?.laminationUnit?.isAvailable : ''
                },
                {
                    name: "glueNeeded",
                    label: "machineAttributes.glueNeeded",
                    type: "switch",
                    placeholder: "machineAttributes.glueNeeded",
                    required: true,
                    parameterKey: "glueNeeded",
                    options: [],
                    value: state.attributes?.laminationUnit?.glueNeeded ? state.attributes?.laminationUnit?.glueNeeded : '',
                    disabled: !state.attributes?.laminationUnit?.isAvailable
                },
            ]
        },
        state.attributes?.laminationUnit?.glueNeeded && state.attributes?.laminationUnit?.isAvailable ?
            {
                name: "machineAttributes.glues",
                label: "machineAttributes.glues",
                type: "text",
                placeholder: "machineAttributes.glues",
                required: true,
                parameterKey: "laminationGlues",
                options: [],
                machineInputType: 'materialInput',
                value: state?.attributes?.laminationGlues,
                isValid: true,
                materialType: 'colors'
            } :
            {
                name: '',
                label: '',
                value: '',
                parameterKey: '',
                disabled: true
            },
    ]
}
const LaminationUnitComponent = ({}: IStepFormProps) => {
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

export {LaminationUnitComponent};