import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {EStatus} from "@/shared";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, successColor, errorColor, warningColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            circle: {
               width: '20px',
               height: '20px',
               borderRadius: '50%',
               boxSizing: 'border-box' as 'border-box'
            },
            [EStatus.DONE]: {
                backgroundColor: successColor(500),
            },
            [EStatus.FAULT]: {
                backgroundColor: errorColor(500),
            },
            [EStatus.IN_PROCESS]: {
                backgroundColor: warningColor(500),
            },
            [EStatus.NOT_YET]: {
                backgroundColor: '#fff',
                border: '3px solid ' + warningColor(500)
            },
            label: {
               width: '99px',
               height: '40px',
               ...FONT_FAMILY.Lexend(500, 16),
               color: '#821A1A',
                textAlign: 'center' as 'center',
                padding: '20px 0',
                overFlow: 'hidden' as 'hidden',
                borderRadius: '8px'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
