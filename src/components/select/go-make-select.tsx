import {styled} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import {FONT_FAMILY} from "@/utils/font-family";
import {MenuItem, Select} from "@mui/material";
import {useState} from "react";

interface ISelectProps {
    options: { value: string | number, label: string }[];
    disabled?: boolean;
}

const StyledInput = styled(InputBase)(({theme}) => {
    return {
        '& .MuiInputBase-input': {
            borderRadius: 16,
            position: 'relative',
            backgroundColor: '#F4F3FF',
            // border: '1px solid #5925DC',
            width: 'fit-content',
            fontSize: 16,
            padding: '6px 26px 6px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            ...FONT_FAMILY.Lexend(500, 14),
            color: '#5925DC',
            '&:focus': {
                borderRadius: 16,
                borderColor: '##5925DC',
                boxShadow: '0 0 0 0.2rem #F4F3FF',
            },
            '&.Mui-disabled': {
                color: '#5925DC',
            }
        },
    }
});
const GoMakeSelect = ({options, disabled}: ISelectProps) => {
    const [value, setValue] = useState<any>(options[0].value);
    const handleChange = (event: { target: { value: string } }) => {
        setValue(event.target.value);
    };
    return (
        <Select
            disabled={disabled}
            sx={{
                width: 'fit-content',
                '& .MuiSelect-icon': {
                    color: '#5925DC'
                },
                '&.Mui-disabled': {
                    '& .MuiSelect-icon': {
                        display: 'none'
                    },
                }
            }}
            value={value}
            onChange={handleChange}
            input={<StyledInput/>}
        >
            {
                options.map(({value, label}) => <MenuItem value={value}>{label}</MenuItem>)
            }
        </Select>
    )
}

export {GoMakeSelect}