import {GomakeTextInput} from "@/components";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";

import {useStyle} from "@/widgets/admin-machines/components/style";
import {MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {IMachineInput} from "@/widgets/admin-machines/interfaces/inputs-interfaces";

const MachineInput = ({input, error, changeState}: IMachineInput) => {
    const [state, setState] = useState<string>(input.type === 'select' ? input.options[0]?.value : []);
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeState = (e: ChangeEvent<HTMLInputElement>) => {
        changeState(input.parameterKey, e.target.value as string);
    };
    const selectChange = (event: SelectChangeEvent) => {
        changeState(input.parameterKey, event.target.value)
        setState(event.target.value);
    }
    return (
        <div style={classes.inputContainer} key={input.parameterKey}>
            <div style={classes.inputLbl}>{t(input.label)}</div>
            <div style={classes.input}>
                {
                    input.type === 'select' ?
                        <Select
                            style={{height: '40px'}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={input.label}
                            onChange={selectChange}
                            value={input.value || state}
                            disabled={!!input.disabled}>
                            {
                                input.options.map(option => <MenuItem key={option.value} value={option.value}>{t(option.text)}</MenuItem>)
                            }
                        </Select> :
                        <GomakeTextInput
                            style={{height: '40px'}}
                            onChange={onChangeState}
                            type={input.type}
                            error={error}
                            placeholder={input.placeholder}
                            disabled={!!input.disabled}
                            value={input.value}
                        />
                }

            </div>
        </div>
    );
};
export {MachineInput};
