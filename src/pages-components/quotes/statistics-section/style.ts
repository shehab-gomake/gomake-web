import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            createNew: {
                width: "160px",
                height: "40px",
                borderRadius: "4px",
                background: "#DCDCEC",
                color: "#101020",
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: "20px",
                textTransform: "none" as "none",
                // justifyContent: "flex-start",
                gap: "10px",
                boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"
            },
            ticketStyle: {
                display: "flex",
                width: "192px",
                height: "40px",
                background: "#FFFFFF",
                alignItems: "center",
            },
            ticketContentStyle: {
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: "0px 10px",
                alignItems: "center"
            },
            numberStyle: {
                ...FONT_FAMILY.Lexend(500, 24),
                lineHeight: "30px",
            },
            textStyle: {
                ...FONT_FAMILY.Lexend(400, 14),
                lineHeight: "17.5px",
                display: "flex",
                width: "100%",
                gap: "5px",
                alignItems: "center",
            },
            verticalLine: {
                borderLeft: "1px solid #000",
                height: "20px",
                margin: "0 5px"
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };