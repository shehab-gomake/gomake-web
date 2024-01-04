import * as React from "react";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate } from "./auto-complete";
import { useStyle } from "./style";

interface IProps {
    options: Array<{ value: string; label: string }>;
    values: string[];
    onChange: (values: string[]) => void;
    style?: React.CSSProperties;
    placeholder?: string;
}

const GoMakeMultiSelect = ({ options, values, style, onChange , placeholder="" }: IProps) => {
    const { classes } = useStyle();
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

        const handleSelectCheck = (isChecked: boolean, option: any) => {
            const updatedValues = isChecked
              ? [...values, option?.value]
              : values.filter(v => v !== option?.value);
            onChange && onChange(updatedValues);
          };

    return (
        <GoMakeAutoComplate
            style={style || classes.multiSelectStyle}
            value={selectedLabels}
            disableClearable={true} placeholder={placeholder}
            options={reorderedOptions}
            renderOption={(props: any, option: any) => {
                return (
                    <Stack style={classes.multiSelectOption}>
                        <div>
                            <Checkbox
                                onChange={(e, checked) => handleSelectCheck(checked, option)}
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
            PaperComponent={(props: any) => <Paper style={style || classes.multiSelectStyle} {...props}>{props?.children}</Paper>}
        />
    );
};

export { GoMakeMultiSelect };
