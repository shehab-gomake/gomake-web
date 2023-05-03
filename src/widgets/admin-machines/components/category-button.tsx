import {styled} from "@mui/material/styles";
import Button, {ButtonProps} from "@mui/material/Button";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

const CategoryButton = styled(Button)<ButtonProps>((props: ButtonProps) => {
    const {secondColor, primaryColor} = useGomakeTheme();
    return {
            color: props.color === 'primary' ? primaryColor(700) : '#FFFFFF'  ,
            backgroundColor: props.color === 'primary' ? primaryColor(100) : secondColor(500),
            ...FONT_FAMILY.Lexend(500, 16),
        '&:hover': {
            backgroundColor: props.color === 'primary' ? primaryColor(300) : secondColor(700),
            color: '#FFFFFF'
        },
    }
});

export {CategoryButton}