import {GoMakeAutoComplate, GomakeTextInput, SecondSwitch} from "@/components";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/machines/components/inputs/style";
import {IMachineInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useGomakeAxios} from "@/hooks";

const MachineInput = ({input, error, changeState, readonly}: IMachineInput) => {
    const [options, setOptions] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(' ');
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const {classes} = useStyle();


    const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, e.target.value as string);
    };
    const selectChange = (event: SyntheticEvent, value): void => {
        setSelectedLabel(value.label);
        changeState(input.parameterKey, value.value)
    }

    const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, event.target.checked);
    };

    useEffect(() => {
        const selectedValue = options?.find(option => option.value === input.value);
        if (selectedValue) {
            setSelectedLabel(selectedValue.label);
        }
    }, [input, options])

    useEffect(() => {
        if (input.optionsUrl) {
            callApi('GET', input.optionsUrl).then(
                (res) => {
                    if (res?.success) {
                        setOptions(res?.data?.data?.data?.map(({value, text}) => ({label: text, value})));
                    }
                }
            )
        } else {
            setOptions(input.options.map(({value, text}) => ({label: text, value})))
        }
    }, [input])
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
                                    value={selectedLabel}
                                    error={false}
                                    disabled={!!readonly}
                                    placeholder={t(input.placeholder)}
                                options={options}/>:
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
