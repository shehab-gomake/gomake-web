import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { theme, primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            menuItem: {
                display: 'flex',
                width: 125,
                justifyContent: 'space-between',
                alignItems: 'center',
                color: primaryColor(300)
            },
            menuBtn: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: primaryColor(300),
                height: '10px'
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };