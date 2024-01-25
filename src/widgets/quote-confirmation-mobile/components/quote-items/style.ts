import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { secondColor, grayColor, theme } = useGomakeTheme();

    const classes = useMemo(() => {
        return {
            cardContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                width: "70%",
                marginBottom: "10px",
                background: "#F4F1F6", minHeight: "295px",
                boxShadow: "none",
                borderRadius: "12px",
                padding: "12px",
                gap: "16px"
            },
            rowStyle: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%"
            },
            headerStyle: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: grayColor(500),
                lineHeight: "15px"
            },
            showAll: {
                ...FONT_FAMILY.Lexend(600, 14),
                color: secondColor(500),
                lineHeight: "17.5px"
            },
            detailsStyle: {
                ...FONT_FAMILY.Lexend(500, 14),
                padding: "4px 0px 0px 0px",
                height: "max-content",
                borderRight: "none"
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
