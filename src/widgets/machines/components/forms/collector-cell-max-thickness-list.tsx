import {useStyle} from "@/widgets/machines/components/forms/style";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {useCallback} from "react";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";


const useCollectorCellsMaxThickness = (controlled: boolean) => {
    const machineState = useRecoilValue(STATE);
    const cellNumber: number = machineState.attributes?.cellNumber ? +machineState.attributes?.cellNumber : 0
    const cellListStateValue: any [] = machineState.attributes?.cellsMaxThicknessList ? machineState.attributes?.cellsMaxThicknessList : [];
    const show: boolean = controlled ?  !!machineState.attributes?.isAvailableCollectorUnit && cellNumber > 0 : cellNumber > 0;
    const getListValue = useCallback(() => {
        if (cellListStateValue?.length > 0 && cellNumber > 0 && cellListStateValue?.length > cellNumber) {
            return cellListStateValue?.slice(0, cellNumber);
        }
        if (cellListStateValue?.length > 0 && cellNumber > 0 && cellListStateValue?.length < cellNumber) {
            const arr = []
            for(let i = 0; i < cellNumber - cellListStateValue?.length ; i++) {
                arr.push(i + 1 + cellListStateValue?.length);
            }
            return [...cellListStateValue, ...arr.map((c, ) => ({cell: c, maxThickness: 0}))];
        }

        if (cellNumber === 0) {
            return []
        }
        if (cellNumber > 0 && !machineState.attributes?.cellsMaxThicknessList) {
            const res = []
            for(let i = 0; i < cellNumber; i++) {
                res.push(i);
            }
            return res.map((c, i) => ({cell: i + 1, maxThickness: 0}));
        }

        return cellListStateValue;
    }, [cellNumber, cellListStateValue])

    const listInput = {
        name: 'machineAttributes.cellsMaxThicknessList',
        parameterKey: 'cellsMaxThicknessList',
        value: getListValue(),
        machineInputType: 'multiArrayInput',
        disableAddValue: true,
        isValid: true,
        inputs: [
            {
                name: "cell",
                label: "machineAttributes.cell",
                type: "text",
                placeholder: "machineAttributes.cell",
                required: true,
                parameterKey: "cell",
                options: []
            },
            {
                name: "maxThickness",
                label: "machineAttributes.maxThickness",
                type: "text",
                placeholder: "machineAttributes.maxThickness",
                required: true,
                unit: EMeasurementUnits.MM,
                parameterKey: "maxThickness",
                options: []
            },
        ]
    };
    return {
        listInput,
        show
    }
}
const CollectorCellsMaxThickness = ({controlled}: {controlled?: boolean}) => {
    const {classes} = useStyle();
    const {listInput, show} = useCollectorCellsMaxThickness(!!controlled);
    const {changeMachineAttributes, errors} = useMachineAttributes();

    return (
        show && <div style={classes.container}>
            <div style={classes.inputsContainer}>

                <InputContainer key={listInput.parameterKey} attribute={listInput}
                                newValue={changeMachineAttributes}
                                disableUpdateValues={false}
                                updateState={changeMachineAttributes} error={errors[listInput.parameterKey]}/>
            </div>
        </div>
    );
}

export {CollectorCellsMaxThickness};