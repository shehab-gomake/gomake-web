import {IArrayInput, IInput} from "@/widgets/add-machine/interface/inputs-interfaces";
import {GomakePrimaryButton} from "@/components";
import {ChangeEvent, useState} from "react";
import {useStyle} from "@/widgets/add-machine/printing-machine/style";
import DeleteIcon from '@mui/icons-material/Delete';
import {InputContainer} from "@/widgets/add-machine/utils/inputs";

const ArrayInput = ({name, inputs, updateState, parameterKey, value}: IArrayInput) => {
    const [state, setState] = useState<Record<string, any>>({});
    const {classes} = useStyle();
    const addParameter = () => {
        updateState(parameterKey, [...value, state]);
        setState({});
    }
    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        setState({...state, [e.target.name]: e.target.value})
    }

    const handleInputChanges1 = (key: string, value: string) => {
        setState({...state, [key]: value})
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
        const newArray = value;
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
                        return <InputContainer key={input.key}
                                               input={input}
                                               error={false}
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

export {ArrayInput};