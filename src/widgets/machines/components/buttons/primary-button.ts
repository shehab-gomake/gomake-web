import {styled} from "@mui/material/styles";
import Button, {ButtonProps} from "@mui/material/Button";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

const PrimaryButton = styled(Button)((props: ButtonProps) => {
    const {primaryColor} = useGomakeTheme();
    return {
        boxShadow: "none",
        textTransform: "none",
        padding: "10px 32px",
        lineHeight: "1.5px",
        height: 40,
        width: '100%',
        backgroundColor: primaryColor(500),
        borderRadius: 4,
        borderColor: primaryColor(500),
        gap: 7,
        color: "#FFFFFF",
        transition: "0.25s",
        ...FONT_FAMILY.Lexend(500, 16),
        "&:hover": {
            letterSpacing: "0.1em",
            backgroundColor: primaryColor(500),
            borderColor: primaryColor(500),
        },
        '&.Mui-disabled': {
            backgroundColor: primaryColor(200),
            color: '#FFFFFF'
        },
    }
});

export {PrimaryButton}