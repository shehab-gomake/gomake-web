import { IMachineMultiInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { useEffect } from "react";
import { useStyle } from "@/widgets/machines/components/inputs/style";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";

const MachineMultiInput = ({ parameterKey, inputs, name, updateState, value, disabled }: IMachineMultiInput) => {
    const { classes } = useStyle();
    const { t } = useTranslation();

    const onchange = (key: string, newValue: any) => {
        const next = { ...(value || {}), [key]: newValue };
        updateState(parameterKey, next);
    };

    return (
        !disabled && <div style={classes.multiInputContainer}>
            <h3 style={classes.multiInputLabel}>{t(name)}</h3>
            <div style={classes.inputsRow}>
                {
                    inputs.map(input => <FormInput key={input.parameterKey} input={input} changeState={onchange} error={false} />)
                }
            </div>
        </div>
    );
}

export { MachineMultiInput };