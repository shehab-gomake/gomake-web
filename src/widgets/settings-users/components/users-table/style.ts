import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor, successColor, errorColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            tableHeader: {
                ...FONT_FAMILY.Lexend(500, 14),
                letterSpacing: '-0.14px',
                color: '#B5B7C0',
                height: 38
            },
            tableBody: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: primaryColor(900),
                height: 50
            },
            icon: {
                width: 16,
                height: 16,
                color: primaryColor(300)
            },
            menuBtn: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: primaryColor(300)
            },
            active: {
                color: successColor(500)
            },
            inActive: {
                color: errorColor(500)
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
