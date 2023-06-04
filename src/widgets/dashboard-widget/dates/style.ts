import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, primaryColor, errorColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                padding: '0 21px 0 32px',
                gap: '32px'

            },
            datesContainer: {
                display: 'flex',
                gap: '16px'
            },
            button: {
                width: 'fit-content',
                minWidth: '134px',
                height: '40px',
                borderRadius: '10px',
                color: primaryColor(500),
                borderColor: primaryColor(500),
                ...FONT_FAMILY.Lexend(500, 16)
            },
            lateButton: {
                width: '134px',
                height: '40px',
                borderRadius: '10px',
                color: errorColor(500),
                borderColor: errorColor(500),
                ...FONT_FAMILY.Lexend(500, 16)
            },
            activeButton: {
                width: '134px',
                height: '40px',
                borderColor: primaryColor(500),
                borderRadius: '10px'
            },
            machinesWrapper: {
                alignSelf: 'flex-end',
                marginRight: 'auto' as 'auto'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
