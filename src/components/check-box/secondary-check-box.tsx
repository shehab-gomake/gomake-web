import {styled} from "@mui/material/styles";
import {Checkbox} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const SecondaryCheckBox = styled(Checkbox)(() => {
    const {secondColor} = useGomakeTheme();
    return {
        color: secondColor(900),
        '&.Mui-checked': {
            color: secondColor(500),
        },
    }
});

export {SecondaryCheckBox}