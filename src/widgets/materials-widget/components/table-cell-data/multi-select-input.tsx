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
    values: string[];
    id: string;
    isAdmin: boolean;
}

const MultiSelectInput = ({ values, parameterKey, id, isAdmin }: IProps) => {
    const { classes } = useStyle();
    const { updateCellData } = useTableCellData(isAdmin);
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);



    const options = machinesCategories.map(machine => ({
        value: machine.id,
        label: `${machine.manufacturer} - ${machine.model}`
    }));

    const reorderedOptions = options.sort((a, b) => {
        const isSelectedA = values.includes(a.value);
        const isSelectedB = values.includes(b.value);

        if (isSelectedA && !isSelectedB) {
            return -1;
        } else if (!isSelectedA && isSelectedB) {
            return 1;
        } else {
            return 0;
        }
    });

    const selectedLabels = values.map(selectedId => options.find(opt => opt.value === selectedId)?.label)
        .filter(label => label !== null && label !== undefined);

    const handleSelectCheck = (parameterKey: string, isChecked: boolean, option: any) => {
        onChangeInputs(parameterKey, isChecked ? [...values, option?.value] : values.filter(v => v !== option?.value));
    };

    const onChangeInputs = async (key, value) => {
        await updateCellData(id, key, value);
    }
    

    return (
        <div style={{ padding: "0px 20px 0px 20px" }}>
            <GoMakeAutoComplate
                style={{ border: 0 }}
                //onChange={onChangeInputs}
                value={selectedLabels}
                disableClearable={true} placeholder={"Select machines"}
                options={reorderedOptions}
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