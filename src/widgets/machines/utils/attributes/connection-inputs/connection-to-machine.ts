import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {usePrintHouseMachines} from "@/widgets/machines/hooks/use-print-house-machines";
import {useEffect, useState} from "react";

const connectionToMachine = (state: Record<string, any>, parameterKey: string, category: ECategoryId, label: string) => {

    const {getMachinesByCategoryId, machinesToList} = usePrintHouseMachines();
    const [res, setRes] = useState([]);
    useEffect(() => {
        getMachinesByCategoryId(category).then(
            (machines) => {

                if (machines.data?.data?.data) {
                    setRes(machinesToList(machines.data?.data?.data))
                }
            }
        );
    }, []);


    return [
        {
            machineInputType: 'multiInput',
            name: `machineAttributes.${label}`,
            parameterKey: parameterKey,
            isValid: true,
            value: state[parameterKey],
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.isConnect",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "isConnect",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['isConnect'] ? !!state.attributes[parameterKey]['isConnect'] : false,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "machineList",
                    label: "machineAttributes.machineList",
                    type: "select",
                    placeholder: "machineAttributes.machineList",
                    required: true,
                    parameterKey: "machine",
                    value:  state.attributes[parameterKey]?.machine ? state.attributes[parameterKey]?.machine : '',
                    options: res,
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect

                },
            ]
        },
    ];
}

export {connectionToMachine};