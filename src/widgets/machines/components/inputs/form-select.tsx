import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {Select, SelectProps} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";

export const FormSelect = styled(Select)((props: SelectProps) => {
    const {secondColor} = useGomakeTheme();
    return {
        ...FONT_FAMILY.Lexend(400, 12),
        '& .MuiSelect-select': {},
        '& .MuiSelect-icon': {
            color: secondColor(400),
        },
        '& 	.Mui-error': {
            borderColor: secondColor(600),
        },
        '& .Mui-disabled': {
            '&.MuiSelect-icon': {
                display: 'none'
            }
        }

    }
});