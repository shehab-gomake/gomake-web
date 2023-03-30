import {useAddPrintingMachine} from "@/widgets/add-machine/utils/use-add-printing-machine";
import {IInput} from "@/widgets/add-machine/interface/inputs-interfaces";
import {InputContainer} from "@/widgets/add-machine/utils/inputs";

const BasicInputsComponent = () => {
    const {machineBasicProps, changeState, errors} = useAddPrintingMachine();
    return (
        <div>
            {
                machineBasicProps.map((property: IInput) => (
                    <InputContainer
                                key={property.key}
                                input={property}
                                changeState={changeState}
                                error={errors[property.key]}
                            />
                ))
            }
        </div>
    );
}

export {BasicInputsComponent};