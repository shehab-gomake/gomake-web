import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {PrintHouseLocationsWidget} from "@/widgets/print-house-loactions-widget/print-house-locations-widget";

const BasicInputsComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {
        machineGeneralAttributes,
        machineBasicAttributes,
        changeMachineGeneralAttributes,
        changeMachineAttributes,
        errors,
        machineState
    } = useMachineAttributes()
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineGeneralAttributes.map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineGeneralAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
                {
                    machineBasicAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
                <div style={{width: '100%'}}>
                    <PrintHouseLocationsWidget onSelectLocation={(locationId) => {
                        changeMachineAttributes('locationId', locationId)
                    }} selectedLocationId={machineState?.attributes?.locationId || ''}/>
                </div>
            </div>
        </div>
    );
}

export {BasicInputsComponent};