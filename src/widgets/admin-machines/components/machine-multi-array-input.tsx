import {GomakePrimaryButton} from "@/components";
import {ChangeEvent, useState} from "react";
import {useStyle} from "@/widgets/admin-machines/components/style";
import DeleteIcon from "@mui/icons-material/Delete";
import {IMachineMultiArrayInput, IInput} from "@/widgets/admin-machines/interfaces/inputs-interfaces";
import {MachineInput} from "@/widgets/admin-machines/components/machine-inputs";

const MachineMultiArrayInput = ({name, inputs, updateState, parameterKey, value}: IMachineMultiArrayInput) => {
    const [state, setState] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, boolean>>()
    const {classes} = useStyle();
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
        })
        setErrors(requiredErrors);
        if (canAdd) {
            updateState(parameterKey, [...value, state]);
            setState({});
        }
    }
    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        setState({...state, [e.target.name]: e.target.value})
    }

    const handleInputChanges1 = (key: string, value: string) => {
        setErrors({...errors, [key]: false});
        setState({...state, [key]: value});
    }

    const handleValuesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const index = e.target.getAttribute('data-index');
        if (e && index) {
            const values = value;
            values[+index] = {...values[+index], [e.target.name]: e.target.value};
            updateState(parameterKey, values);
        }
    }

    const handleRemoveRow = (index: number) => {
        const newArray: any[] = [...value];
        newArray.splice(index, 1)
        updateState(parameterKey, newArray);
    }


    return (
        <div style={classes.container}>
            <h3>{name}</h3>
            {
                value.map((v: Record<string, string>, index: number) => {
                    return <div key={'row' + index} style={classes.inputsRow}>
                        {
                            Object.keys(v).map((key) => <input type="text"
                                                               key={key}
                                                               style={classes.inputs}
                                                               name={key}
                                                               data-index={index}
                                                               onChange={handleValuesChange}
                                                               value={v[key]}/>)
                        }

                        <DeleteIcon onClick={() => handleRemoveRow(index)} style={classes.deleteIcon}/>
                    </div>
                })
            }
            <div style={classes.inputsRow}>
                {
                    inputs.map((input: IInput, index: number) => {
                        input.value = state[input.parameterKey] ? state[input.parameterKey] : '';
                        return <MachineInput key={input.parameterKey}
                                               input={input}
                                               error={!!(errors && errors[input.parameterKey])}
                                               changeState={handleInputChanges1}/>
                    })
                }
                <div style={classes.addColor}>
                    <GomakePrimaryButton onClick={addParameter} style={classes.button}>Add</GomakePrimaryButton>
                </div>
            </div>
        </div>
    );
}

export {MachineMultiArrayInput}
