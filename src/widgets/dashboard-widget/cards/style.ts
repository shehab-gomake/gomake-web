import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                padding: '24px 21px 24px 32px',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 20px rgba(238, 238, 238, 0.501967)',
                borderRadius: '20px',
                border: '1px solid #F8F9FA'
            },
            statistics: {
                display: 'flex',
                justifyContent: 'space-between',
                gap: '32px',
                height: '184px'
            },
            header: {
                ...FONT_FAMILY.Lexend(600, 20),
                color: primaryColor(900),
                marginBottom: '20px'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
