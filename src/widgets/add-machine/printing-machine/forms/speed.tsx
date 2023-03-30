import {useAddPrintingMachine} from "@/widgets/add-machine/utils/use-add-printing-machine";
import {ArrayInput} from "@/widgets/add-machine/utils/arrayInput";

const SpeedSettingsComponent = () => {
    const {machineSpeedProps, changeState, errors} = useAddPrintingMachine();

    return (
        <div>
            {
                machineSpeedProps.map(property => (
                    <ArrayInput key={property.key} name={property.name} parameterKey={property.key}
                                value={property.value}
                                inputs={property.inputs} updateState={changeState}/>
                ))
            }
        </div>
    );
};

export {SpeedSettingsComponent};