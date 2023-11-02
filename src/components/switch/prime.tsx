import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Switch, SwitchProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const PrimarySwitch = styled(Switch)((props: SwitchProps & { colorX?: string, direction?: string, theme }) => {
    const { primaryColor } = useGomakeTheme();
    const { t } = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    return {
        width: 36,
        height: 20,
        padding: 0,
        marginRight: dir == "ltr" ? '8px' : '0px',
        marginLeft: dir == "rtl" ? '8px' : '0px',
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: primaryColor(600),
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },

        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 16,
            height: 16,

        },
        '& .MuiSwitch-track': {
            borderRadius: 24 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
        },
    }
});

export { PrimarySwitch }