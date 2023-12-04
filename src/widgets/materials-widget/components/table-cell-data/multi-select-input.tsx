import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { materialsMachinesState } from "@/widgets/materials-widget/state";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { multiSelectInput } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";

interface IProps {
    parameterKey: string;
    id: string;
    values: string[];
}

const MultiSelectInput = ({ values, parameterKey, id }: IProps) => {
    const { updateCellData } = useTableCellData();
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);
    const [state, setState] = useState<any>({});

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
        updateCellData(id, 'machines', value);
    }

    return (
        <Stack
        // width={"150px"} 
        >        {
                multiSelectInput(state, machinesCategories, values).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
            }</Stack>

    )
}

export { MultiSelectInput }