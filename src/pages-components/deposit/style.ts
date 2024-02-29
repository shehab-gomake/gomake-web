import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const { t } = useTranslation();
    const { theme, grayColor ,secondColor } = useGomakeTheme();
    const dir = t('direction');
    const classes = useMemo(() => {
        return {
            mainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "100%",
                position: "relative" as "relative",
                height: "100%",
                overflow: "hidden",
              },
              secondContainer: {
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column" as "column",
                padding : "none"
              },
              titleContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 5,
              },
              titleSettingContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: 14,
              },
              borderSecondContainer: {
                width: "100%",
                borderBottom: `1px solid ${grayColor(200)}`,
                marginBottom: 12,
                marginTop: 12,
                maxHeight: 140,
                overflow: "scroll",
              },
              depositNumberStyle: {
                ...FONT_FAMILY.Lexend(500, 24),
                color: secondColor(500),
                lineHeight: "30px",
              },



              tableRowStyle: {
             //   height: headerHeight,
                background: "#8283BE",
                color: "white",
              },
              tableHeaderStyle: {
                borderRight: "1px solid #EAECF0",
                color: "#FFF",
                textAlign: "center" as "center",
                backgroundColor: "inherit",
                ...FONT_FAMILY.Inter(400, 12),
              },
              cellContainerStyle: {
                textAlign: "center" as "center",
                padding: "0px 24px",
              },
              tableFooterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
                boxShadow: " 0px 1px 3px 0px #1018281A",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              },
              priceFooterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "43%",
                boxShadow: " 0px 1px 3px 0px #1018281A",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              },
              priceReceiptFooterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "40%",
                boxShadow: " 0px 1px 3px 0px #1018281A",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
              },
              firstRowForFooterContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
              },
              evenRowContainer: {
                display: "flex",
                textAlign: "center" as "center",
                padding: "12px 24px",
                color: "#FFFF",
                background: "#8283BE",
                ...FONT_FAMILY.Inter(500, 12),
                height: 44,
              },
              lastRowContainer: {
                display: "flex",
                textAlign: "center" as "center",
                padding: "12px 24px",
                color: "#FFFF",
                background: "#8283BE",
                ...FONT_FAMILY.Inter(500, 12),
                height: 44,
                width: "50%",
                borderBottomRightRadius: dir === "rtl" ? 6 : 0,
                borderBottomLeftRadius: dir === "rtl" ? 0 : 6,
              },
              oddRowContainer: {
                display: "flex",
                padding: "12px 24px",
                background: "#FFFFFFF",
                ...FONT_FAMILY.Inter(400, 14),
                height: 44,
              },
              cellTextInputStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
        };
    }, [t, theme]);
    return {
        classes,
    };
};
export { useStyle };