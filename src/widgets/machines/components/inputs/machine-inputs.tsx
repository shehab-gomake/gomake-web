import {GoMakeAutoComplate, GomakeTextInput, SecondSwitch} from "@/components";
import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/machines/components/inputs/style";
import {SelectChangeEvent} from "@mui/material";
import {IMachineInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useGomakeAxios} from "@/hooks";

const MachineInput = ({input, error, changeState, readonly}: IMachineInput) => {
    const [options, setOptions] = useState([]);
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, e.target.value as string);
    };
    const selectChange = (event: SelectChangeEvent<any>, child: ReactNode): void => {
        changeState(input.parameterKey, event.target.value)
    }

    const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, event.target.checked);
    };
    useEffect(() => {
        if (input.optionsUrl) {
            callApi('GET', input.optionsUrl).then(
                (res) => {
                    if (res?.success) {
                        setOptions(res?.data?.data?.data);
                    }
                }
            )
        }
    }, [input.optionsUrl])
    return (
        <>
            {
                !input.disabled && <div style={classes.inputContainer} key={input.parameterKey}>
                    <div style={classes.inputLbl}>{t(input.label)}</div>
                    <div style={classes.input}>
                        {
                            input.type === 'select' ?
                                <GoMakeAutoComplate
                                    style={{minWidth: 200, border: 0}}
                                    onChange={selectChange}
                                    value={!!input.value ? input.value : ''  }
                                    error={false}
                                    disabled={!!readonly}
                                    placeholder={t(input.placeholder)}
                                options={input.optionsUrl ? options.map(({value, text}) => ({label: text, value})) : input.options.map(({value, text}) => ({label: text, value}))}/>:
                                input.type === 'switch' ?
                                    <SecondSwitch checked={!!input.value} onChange={handleSwitchCheck}/>
                                    :
                                    <GomakeTextInput
                                        style={{height: '40px'}}
                                        onChange={onChangeState}
                                        type={input.type}
                                        error={error}
                                        placeholder={t(input.placeholder)}
                                        disabled={!!readonly}
                                        value={input.value}
                                    />
                        }

                    </div>
                </div>
            }
        </>
    );
};
export {MachineInput};
