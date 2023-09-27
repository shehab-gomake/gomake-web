import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                position: "relative" as "relative",
                display: "flex",
                flexDirection: 'column' as 'column',
                gap: "16px"
            },
            header: {
                position: 'sticky' as 'sticky',
                top: 0,
                width: '100%',
                backgroundColor: '#FFF',
                zIndex: 1,
                padding: 1,
                paddingTop: 0,
            },
            subTitleStyle: {
                fontStyle: "normal",
                lineHeight: "normal",
                color: "#ED028C",
                ...FONT_FAMILY.Lexend(600, 16),
              },
              subTitleSpanStyle: {
                fontStyle: "normal",
                lineHeight: "normal",
                ...FONT_FAMILY.Lexend(600, 11),
              },
            
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
