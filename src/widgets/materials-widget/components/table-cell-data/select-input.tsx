import React, { SyntheticEvent } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate } from "@/components";

interface IProps {
    parameterKey: string;
    id: string;
    values: string[];
    value: string
}

const SelectInput = ({ values, parameterKey, id, value }: IProps) => {
    const { updateCellData } = useTableCellData();

    const options = values ? values.map(inputValue => ({
        id: inputValue,
        label: inputValue
    })) : [] ; 

    const onSelectChange = async (event: SyntheticEvent, value) => {
        await updateCellData(id, parameterKey, value?.id);
    }

    return (
        <div style={{padding:"0px 20px 0px 20px"}}>
            <GoMakeAutoComplate
                onChange={onSelectChange}
                value={value}
                style={{ border: 0 }}
                options={options} />
        </div>
    )
}

export { SelectInput }