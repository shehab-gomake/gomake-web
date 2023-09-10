import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            addBtn: {
                ...FONT_FAMILY.Lexend(500, 16),
                backgroundColor: primaryColor(100),
                color: primaryColor(900),
                '&:hover': {
                    backgroundColor: primaryColor(200),
                },
                textTransform: 'capitalize'
            },
            deleteIcon: {
                cursor: 'pointer',
                alignSelf: 'flex-end'
            },
            iconColor: secondColor(500),
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
