import { useState } from "react";
import { useStyle } from "@/widgets/machines/components/inputs/style";
import { useTranslation } from "react-i18next";
import { RemoveSecondaryBtn } from "@/components/button/remove-secondary-btn";
import { IFormArrayInputsProps, IInput } from "@/components/form-inputs/interfaces";
import { SecondaryButton } from "@/components/button/secondary-button";
import { FormInput } from "./form-input";
import { TransitionGroup } from "react-transition-group";
import { Collapse } from "@mui/material";
import { useSnackBar } from "@/hooks";

const FormArrayInput = ({
    name,
    inputs,
    updateState,
    parameterKey,
    value,
    isValid,
    newValue,
    disableUpdateValues,
    disabled,
    disableAddValue
}: IFormArrayInputsProps) => {
    const { alertFault } = useSnackBar();
    const [state, setState] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, boolean>>();
    const { t } = useTranslation();
    const { classes } = useStyle();
    const addParameter = () => {
        let canAdd: boolean = true;
        const requiredErrors: Record<string, boolean> = {};
        inputs.forEach((input) => {
            if (input.required) {
                if (!state[input.parameterKey]) {
                    requiredErrors[input.parameterKey] = true;
                    canAdd = false;
                }
            }
            if (!!input.regex) {
                if (!input.regex.test(state[input.parameterKey])) {
                    canAdd = false;

                }
            }

        })
        setErrors(requiredErrors);
        if (canAdd) {
            updateState(parameterKey, [...value, state]);
            setState({ name: '' });
        }
        else {
            if (name === "usersSettings.ipAddresses") {
                alertFault("the ip address 192.168.1.1 for example");

            }

        }
    }

    const handleInputChanges1 = (key: string, value: string) => {
        setErrors({ ...errors, [key]: false });
        setState({ ...state, [key]: value });
        if (!!newValue) {
            newValue(key, value);
        }

    }

    const handleValuesChange = (key: string, newValue: any, index: number) => {
        const values = [...value];
        values[index] = { ...values[index], [key]: newValue };
        updateState(parameterKey, values);
    }

    const handleRemoveRow = (index: number) => {
        const newArray: any[] = [...value];
        newArray.splice(index, 1)
        updateState(parameterKey, newArray);
    }


    return (
        !disabled && <div style={classes.container}>
            <h3 style={{ ...classes.multiInputLabel, margin: '0 0 16px 0' }}>{t(name)}</h3>
            {
                !disableAddValue && <div style={classes.inputsRow}>
                    {
                        inputs.map((input: IInput, index: number) => {
                            input.value = state[input.parameterKey] ? state[input.parameterKey] : '';
                            return <FormInput key={input.parameterKey + index}
                                input={input}
                                error={!!input.value && !!input.regex ? !input.regex.test(input.value) : !!(errors && errors[input.parameterKey]) || !isValid}
                                changeState={handleInputChanges1} />
                        })
                    }
                    <div style={classes.addColor}>
                        <SecondaryButton variant={'contained'} onClick={addParameter}
                            style={classes.button}>{t('navigationButtons.add')}</SecondaryButton>
                    </div>
                </div>
            }
            <TransitionGroup>
                {
                    value?.map((v: Record<string, string>, index: number) => {
                        return <Collapse>
                            <div key={'row' + index} style={{ ...classes.inputsRow, paddingTop: 12 }}>
                                {
                                    inputs.map((input) => <FormInput
                                        key={index}
                                        readonly={disableUpdateValues}
                                        input={{
                                            ...input,
                                            value: v[input.parameterKey],
                                            disabled: false,
                                            type: disableUpdateValues ? 'text' : input.type
                                        }} error={false}
                                        changeState={(key, value) => {
                                            handleValuesChange(key, value, index);
                                        }}
                                    />)
                                }
                                <RemoveSecondaryBtn onClick={() => handleRemoveRow(index)} />
                            </div>
                        </Collapse>
                    })
                }
            </TransitionGroup>
        </div>
    );
}

export { FormArrayInput }
