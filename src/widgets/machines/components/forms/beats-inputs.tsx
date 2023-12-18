import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {useEffect} from "react";
import {getPrintColorsParametersValues} from "@/services/api-service/parameters/print-house-machines-colors";
import {useGomakeAxios} from "@/hooks";
import {useSetRecoilState} from "recoil";
import {printColorsParameterValuesState} from "@/widgets/machines/state/print-colors-parameter-values-state";

const BeatsInputsComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {callApi} = useGomakeAxios();
    const setPrintColors = useSetRecoilState(printColorsParameterValuesState);
    const {machineBeatsAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    useEffect(() => {
        const callBack = (res) => {
            if (res?.success) {
                setPrintColors(res?.data);
            }
        }
        getPrintColorsParametersValues(callApi, callBack).then();
    }, [])
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineBeatsAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    })
                }
            </div>
        </div>
    );
}

export {BeatsInputsComponent};