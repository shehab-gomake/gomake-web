import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor, grayColor, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            title: {
                ...FONT_FAMILY.Inter(600, 20),
                color: primaryColor(600)
            },
            divider: {
                width: '2px',
                backgroundColor: primaryColor(600)
            },
            parameterLabel: {
                ...FONT_FAMILY.Inter(500, 14),
                color:  grayColor(500)
            },
            parameterValue: {
                ...FONT_FAMILY.Inter(600, 14),
                color:  grayColor(700)
            },
            productType: {
                ...FONT_FAMILY.Inter(700, 20),
                color: secondColor(600)
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};