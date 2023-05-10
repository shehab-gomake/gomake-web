import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {primaryColor, theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                justifyContent: 'center' as 'center',
                alignItems: 'center' as 'center',
                height: '100vh',
            },
            modal: {
                width: '518px',
                height: '214px',
                backgroundColor: '#FFFFFF',
                padding: '24px',
                borderRadius: '16px',
                justifyContent: 'space-between' as 'space-between',
                display: 'flex',
                flexDirection: 'column' as 'column',
                alignItems: 'space-between' as 'space-between',
            },
            header: {
                ...FONT_FAMILY.Lexend(500, 24),
                color: primaryColor(500)
            },
            submitBtn: {
                alignSelf: 'flex-end'
            }

        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
