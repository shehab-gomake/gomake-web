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
                color: successColor(700)
            },
            [EStatus.FAULT]: {
                backgroundColor: errorColor(500),
                color: errorColor(700)
            },
            [EStatus.IN_PROCESS]: {
                backgroundColor: warningColor(500),
                color: warningColor(700)
            },
            [EStatus.NOT_YET]: {
                backgroundColor: '#fff',
                border: '3px solid ' + warningColor(500),
                color: warningColor(700)
            },
            [EStatus.WAITING]: {
                backgroundColor: '#D98E2C',
                color: '#83561A'
            },
            label: {
               width: '99px',
               height: '25px',
               ...FONT_FAMILY.Heebo(500, 14),
                display: 'flex',
                justifyContent: 'center' as 'center',
                alignItems: 'center' as 'center',
                textAlign: 'center' as 'center',
                // padding: '50px 0',
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
