import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            tableStyle: {
                border: "1px dotted #c9c8c3",
                borderRadius: 4,
                width: "92%",
                boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
              },
        
            headersStyle: {
                color: primaryColor(800),
                ...FONT_FAMILY.Lexend(500, 14),
                letterSpacing: '-1%',
                lineHeight: "17.5px",

            },
            dataRowStyle: {
                ...FONT_FAMILY.Lexend(500, 14),
                lineHeight: "17.5px",
                color: primaryColor(500),
                letterSpacing: '-1%',
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
