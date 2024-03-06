import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const { t } = useTranslation();
    const { theme, secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            mainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                paddingLeft: 20,
                paddingRight: 20,
                height: "100%",
                overflowY: "hidden" as "hidden",
                marginBottom: "20px",
                gap: 20,
            },
            headerStyle: {
                display: "flex",
                flexWrap: "wrap" as "wrap",
                gap: 10,
                justifyContent: "space-between",
                width: "100%"
            },
            filtersContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
            },
            selectedFilterContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20,
                width: "70%",
            },
            filterContainerStyle: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
                width: "25%",
            },
            filterLabelStyle: {
                ...FONT_FAMILY.Lexend(500, 14),
                height: 21,
            },
            textInputStyle: {
                width: "100%",
                maxWidth:"180px",
                border: "none",
            },
            searchBtnStyle: {
                height: 40,
                backgroundColor: secondColor(500),
            },
            clearBtnStyle: {
                height: 40,
                backgroundColor: "#FFF",
                border: `1px solid ${secondColor(500)}`,
                color: secondColor(500),
                width: "50%",
            },
            createNew: {
                width: "160px",
                height: "40px",
                borderRadius: "4px",
                background: "#DCDCEC",
                color: "#101020",
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: "20px",
                textTransform: "none" as "none",
                gap: "10px",
            },
        };
    }, [t, theme]);
    return {
        classes,
    };
};
export { useStyle };