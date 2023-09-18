import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            tabsContainer: {
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',
                alignItems: 'center' as 'center'
            },
            addBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: primaryColor(100),
                color: primaryColor(900),
                '&:hover': {
                    backgroundColor: primaryColor(200),
                },
                marginBottom: '20px',
                textTransform: 'capitalize'
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
