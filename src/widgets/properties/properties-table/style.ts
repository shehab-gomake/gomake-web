import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { theme, primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            headerContainer: {
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',
                alignItems: 'center' as 'center',
                margin: '30px 0 25px 0'
            },
            header: {
                ...FONT_FAMILY.Lexend(700, 20),
                color: primaryColor(500),
            },
            searchInput: {
                width: 300,
                height: 40
            },
            shadowBorder: {
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            },
            rowItem: {
                display: "flex",
                justifyContent: "center",
                flexDirection: "column" as "column",
                alignItems: "center",
                ...FONT_FAMILY.Lexend(400, 14),
                lineHeight: "18px",
                color: primaryColor(900),
                marginBottom: 2.5,
                marginTop: 2.5,
                textAlign: "center" as "center",
                maxHeight: 45,
                overflowX: "hidden" as "hidden",
                overflowY: "scroll" as "scroll",
                paddingTop: 6,
            },
            item:{
                ...FONT_FAMILY.Lexend(400, 14),
                lineHeight: "18px",
                color: primaryColor(900),
                marginBottom: 2.5,
                marginTop: 2.5,
                textAlign: "center" as "center",
                maxHeight: 45,
            }

        };
    }, [theme]);
    return {
        classes,
    };
}
export { useStyle };