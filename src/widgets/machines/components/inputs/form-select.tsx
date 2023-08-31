import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {Select, SelectProps} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";

export const FormSelect = styled(Select)((props: SelectProps) => {
    const {secondColor} = useGomakeTheme();
    return {
        ...FONT_FAMILY.Lexend(400, 12),
        backgroundColor: '#FFF',
        boxShadow: '0px 4px 60px 0px rgba(0, 0, 0, 0.08)',
        minWidth: 180,
        '& .MuiSelect-icon': {
            color: secondColor(400),
            width: 20,
            height: 30
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