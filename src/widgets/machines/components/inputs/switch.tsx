import {styled} from "@mui/material/styles";
import {Switch, SwitchProps} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";


const StyledSwitch = styled(Switch)((props: SwitchProps) => {
    const {secondColor, neutralColor} = useGomakeTheme();
    return {
        ...FONT_FAMILY.Lexend(400, 12),
        width: 34,
        height: 17,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        '&:active': {
            '& .MuiSwitch-thumb': {},
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)',
            },
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(18px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: secondColor(500),
                },
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 13,
            height: 13,
            borderRadius: 10,
        },
        '& .MuiSwitch-track': {
            borderRadius: 10,
            opacity: 1,
            backgroundColor: neutralColor(500),
            boxSizing: 'border-box',
        },
    }
});



export {StyledSwitch}