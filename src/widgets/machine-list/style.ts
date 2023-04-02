import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, neutralColor, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {},
            button: {
                backgroundColor: neutralColor(100),
                boxShadow: '0px 4px 90px rgba(135, 130, 130, 0.2)',
                borderRadius: '10px',
                color: primaryColor(700),
                width: '190px',
                height: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...FONT_FAMILY.Lexend(500, 12)
            },
            machineName: {
                ...FONT_FAMILY.Lexend(500, 12)
            },
            searchInput: {
                maxWidth: '210px',
                margin: '10px'
            }

        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
