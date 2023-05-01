import {styled} from "@mui/material/styles";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {StepLabel, StepLabelProps} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";

const StyledStepLabel = styled(StepLabel)((props: StepLabelProps) => {
    const {primaryColor, secondColor} = useGomakeTheme();
    return {
        '& .MuiStepLabel-root': {
            ...FONT_FAMILY.Lexend(500, 16),
        },
        '& .MuiStepLabel-label': {
            ...FONT_FAMILY.Lexend(500, 16),
        },

        '& & .MuiStepIcon-root': {
            color: primaryColor(500),
        },

        '& .Mui-active': {
            span: {
                ...FONT_FAMILY.Lexend(500, 16),
                color: secondColor(500),
            },
            color: secondColor(500),
            '& .MuiStepIcon-root': {
                color: secondColor(500),
            },
        },
        '& .Mui-completed': {
            span: {
                ...FONT_FAMILY.Lexend(500, 16),
            },
            color: primaryColor(500),
        },
    }
});

export {StyledStepLabel}