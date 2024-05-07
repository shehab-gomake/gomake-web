import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const LateMissionsButton = styled(Button)((props: { selected: boolean }) => {
    const { errorColor } = useGomakeTheme();
    return {
        boxShadow: "none",
        textTransform: "none",
        padding: "14px",
        lineHeight: 1.5,
        backgroundColor: props.selected ? errorColor(500) : "#FFFFFF",
        border: `1px solid ${errorColor(500)}`,
        gap: 7,
        color: props.selected ? "#FFFFFF" : errorColor(500),
        width: '134px',
        height: '40px',
        borderColor: errorColor(500),
        borderRadius: '10px',
        "&:hover": {
            letterSpacing: "0.1em",
            backgroundColor: props.selected ? errorColor(500) : "#FFFFFF",
        },
        transition: "0.25s",
        ...FONT_FAMILY.Lexend(500, 16),
    }
});

export { LateMissionsButton }