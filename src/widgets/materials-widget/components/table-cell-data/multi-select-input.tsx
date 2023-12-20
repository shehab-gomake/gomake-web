import React from "react";
import { useRecoilValue } from "recoil";
import { materialsMachinesState } from "@/widgets/materials-widget/state";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate } from "@/components";
import { Stack } from "@mui/material";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useStyle } from "./style";

interface IProps {
    parameterKey: string;
    id: string;
    values: string[];
}

const MultiSelectInput = ({ values, parameterKey, id }: IProps) => {
    const { classes } = useStyle();
    const { updateCellData } = useTableCellData();
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);

    const onChangeInputs = async (key, value) => {
        await updateCellData(id, key , value);
    }

    const options = machinesCategories.map(machine => ({
        value: machine.id,
        label: `${machine.manufacturer} - ${machine.model}`
    }));

    const selectedLabels = values.map(selectedId => options.find(opt => opt.value === selectedId)?.label)
        .filter(label => label !== null && label !== undefined);

    const handleSelectCheck = (parameterKey: string, isChecked: boolean, option: any) => {
        onChangeInputs(parameterKey, isChecked ? [...values, option?.value] : values.filter(v => v !== option?.value));
    };

    return (
        <div style={{padding:"0px 20px 0px 20px"}}>
            <GoMakeAutoComplate
                style={{ border: 0 }}
                //onChange={onChangeInputs}
                value={selectedLabels}
                disabled={false}
                placeholder={"Select machines"}
                options={options}
                renderOption={(props: any, option: any) => {
                    return (
                        <Stack style={classes.multiSelectOption}>
                            <div>
                                <Checkbox
                                    onChange={(e, checked) => handleSelectCheck(parameterKey, checked, option)}
                                    icon={<CheckboxIcon />}
                                    checkedIcon={<CheckboxCheckedIcon />}
                                    checked={values?.includes(option?.value)} />
                            </div>
                            <div>
                                {option.label}
                            </div>
                        </Stack>
                    )
                }}
                PaperComponent={(props: any) => <Paper style={{ width: "180px" }} {...props}>{props?.children}</Paper>}
            />
        </div>
    )
}

export { MultiSelectInput }