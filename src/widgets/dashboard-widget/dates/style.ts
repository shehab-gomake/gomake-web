import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',
                padding: '0 21px 0 32px',

            },
            datesContainer: {
                display: 'flex',
                gap: '16px'
            },
            button: {
                width: '134px',
                height: '40px',
                borderRadius: '10px',
                color: primaryColor(500),
                borderColor: primaryColor(500),
                ...FONT_FAMILY.Lexend(500, 16)
            },
            activeButton: {
                width: '134px',
                height: '40px',
                borderColor: primaryColor(500),
                borderRadius: '10px'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
