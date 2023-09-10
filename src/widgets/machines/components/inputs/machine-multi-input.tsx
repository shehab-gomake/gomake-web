import {IMachineMultiInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useEffect, useState} from "react";
import {useStyle} from "@/widgets/machines/components/inputs/style";
import {useTranslation} from "react-i18next";
import {FormInput} from "@/components/form-inputs/form-input";

const MachineMultiInput = ({parameterKey, inputs, name, updateState, value}: IMachineMultiInput) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const [state, setState] = useState<Record<string, any>>();
    const onchange = (key: string, value: any) => {
        setState({
            ...state,
            [key]: value,
        })
    }
    useEffect(() => {
        if (value) {
            setState(value);
        }
    }, [value])

    useEffect(() => {
        if (state) {
            updateState(parameterKey, state);
        }
    }, [state])

    return (
        <div style={classes.multiInputContainer}>
            <h3 style={classes.multiInputLabel}>{t(name)}</h3>
            <div style={classes.inputsRow}>
                {
                    inputs.map(input => <FormInput input={input} changeState={onchange} error={false}/>)
                }
            </div>
        </div>
    );
}

export {MachineMultiInput};