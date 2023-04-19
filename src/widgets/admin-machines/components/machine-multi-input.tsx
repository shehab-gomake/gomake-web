import {IMachineMultiInput} from "@/widgets/admin-machines/interfaces/inputs-interfaces";
import {useEffect, useState} from "react";
import {MachineInput} from "@/widgets/admin-machines/components/machine-inputs";

const MachineMultiInput = ({parameterKey, inputs, name, updateState, value}: IMachineMultiInput) => {
    const [state, setState] = useState<Record<string, any>>(value);
    const onchange = (key: string, value: any) => {
        setState({
            ...state,
            [key]: value,
        })
    }

    useEffect(() => {
        if (state) {
            updateState(parameterKey, state);
        }
    }, [state])

    return (
        <div>
            <h3>{name}</h3>
            <div>
                {
                    inputs.map(input => <MachineInput input={input} changeState={onchange} error={false}/>)
                }
            </div>
        </div>
    );
}

export {MachineMultiInput};