import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { primaryColor, secondColor, grayColor, theme } = useGomakeTheme();

    const classes = useMemo(() => {
        return {
            mainContainer: {
                display: "flex",
                width: "70%",
                flexDirection: "column" as "column",
                alignItems: "flex-start",
                alignSelf: "center",
                justifyContent: "center",
                gap: "16px",
            },
            titleQuoteContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 5,
            },
            quoteNumberStyle: {
                ...FONT_FAMILY.Lexend(500, 24),
                color: secondColor(500),
                lineHeight: "30px",
            },
            referenceDate: {
                display: "flex",
                position: "relative" as "relative",
                ...FONT_FAMILY.Lexend(400, 16),
                color: grayColor(500),
                cursor: "pointer",
              },
              borderContainer: {
                width: "100%",
                borderBottom: `1px solid ${grayColor(200)}`,
                marginBottom: 12,
                marginTop: 12,
                maxHeight: 140,
                overflow: "scroll",
              },
              businessContainerStyle: {
                display: "flex",
                flexWrap: "wrap" as "wrap",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                gap: "16px",
                marginBottom:"10px"
              },
              autoCompleteStyle: {
                background: "#FFFFFF",
                filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.08))",
                borderRadius: 4,
                border: "1px solid #FFFFFF",
                height: 30,
                width: "180px",
                ...FONT_FAMILY.Lexend(500, 14)
              },
              labelStyle: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: grayColor(500),
              },
              addNewAddressStyle: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              },
              addNewAddressTextStyle: {
                ...FONT_FAMILY.Lexend(500, 16),
                color: secondColor(500),
              },
              removeAddressTextStyle: {
                ...FONT_FAMILY.Lexend(500, 16),
                color: "rgb(130, 131, 190)",
              },
              inputMainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                //alignItems: "center",
                gap: 5,
              },
              showLessContainer: {
                ...FONT_FAMILY.Inter(600, 14),
                color: primaryColor(500),
               // padding: "8px 14px",
                cursor: "pointer",
                minWidth: 104,
              },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
