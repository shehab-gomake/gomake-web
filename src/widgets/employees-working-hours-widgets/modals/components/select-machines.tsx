import {Stack, TextField} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {IWorkingHoursMachine} from "@/widgets/employees-working-hours-widgets/interface";
import MenuItem from "@mui/material/MenuItem";
import {FONT_FAMILY} from "@/utils/font-family";
import {useTranslation} from "react-i18next";

interface IProps {
    options: IWorkingHoursMachine[];
    values: string[];
    onChange: (values: string[]) => void;
}

const SelectMachines = ({options, values, onChange}: IProps) => {
    const {t} = useTranslation();
    const handleSelectedChange = (options: any) => {
        const updatedValues = options.map(op => op.value);
        onChange && onChange(updatedValues);
    };

    return (
        <Autocomplete
            multiple
            options={options}
            getOptionDisabled={(option) => option.employees.length >= option.minManpowerOperation}
            placeholder={t('materials.inputs.selectMachine')}
            getOptionLabel={(option) => option.label}
            filterSelectedOptions
            disableClearable={true}
            value={options.filter(op => values.includes(op.value))}
            renderOption={(props, option) => option.employees.length > 0 ?
                <MenuItem {...props} disabled={true}>
                    <Stack gap={'5px'}>
                        <span>{option.label}</span>
                        <Stack direction={'row'} flexWrap={'wrap'} gap={'5px'}>
                            <span
                                style={{...FONT_FAMILY.Inter(400, 12)}}>{t('employeeWorkingHours.disabledMachineMsg')}</span>
                            {
                                option.employees.map(employeeName => <span
                                    style={{...FONT_FAMILY.Inter(400, 12)}}>{employeeName}</span>)
                            }
                        </Stack>
                    </Stack>
                </MenuItem> :
                <MenuItem {...props}>
                    {option.label}
                </MenuItem>
            }
            style={{
                border: '1px solid #D0D5DD',
                minHeight: '40px',
                alignItems: 'center',
                display: 'flex',
                borderRadius: '8px',
                padding: '3px 7px',
                direction: 'ltr',
            }}
            onChange={(e, v) => handleSelectedChange(v)}
            renderInput={(params) => (
                <TextField
                    placeholder={values.length > 0 ? '' : t('materials.inputs.selectMachine')}
                    {...params}
                />
            )}
        />
    );
};

export {SelectMachines};