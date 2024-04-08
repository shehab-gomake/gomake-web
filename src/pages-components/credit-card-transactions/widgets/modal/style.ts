import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import {useTranslation} from "react-i18next";
import i18next from "i18next";
const useStyle = () => {
    const { t } = useTranslation();
    const { primaryColor, secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
              mainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                paddingLeft: 20,
                paddingRight: 20,
                width:"100%",
                overflowY: "hidden" as "hidden",
                marginBottom: "20px",
                gap: 20,
              },
             secondContainer:{
              display: "flex",
              flexDirection: "row" as "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              gap:10,

          },
            date1FilterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
                width: "18%",
            },
            statusFilterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
                width: "25%",
            },
            clearBtnStyle: {
                height: 40,
                backgroundColor: "#FFF",
                border: `1px solid ${secondColor(500)}`,
                color: secondColor(500),
                width: "50%",
            },
            date2FilterContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 10,
                width: "100%",
            },
            headerStyle: {
              display: "flex",
              flexWrap: "wrap" as "wrap",
              gap: 10,
              justifyContent: "space-between",
              width: "100%"
            },
            date3FilterContainer: {
              display: "flex",
              flexDirection: "column" as "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 29,
              width: "13%",
          },
          searchFilterContainer: {
            display: "flex",
            flexDirection: "column" as "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 29,
            width: "20%",
        },
        filtersContainer: {
          display: "flex",
          flexDirection: "row" as "row",
          alignItems: "flex-end",
          gap: 20,
          width: "100%",
        },
            filterLabelStyle: {
                ...FONT_FAMILY.Lexend(500, 14),
            },
            textInputStyle: {
                width: "180px",
                border: "none",
            },
            inputsForQuotesContainer:{
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 20
            },
            dateStyle: {
                display: "flex",
                position: "relative" as "relative",
                ...FONT_FAMILY.Lexend(500, 14),
                cursor: "pointer",
                alignItems : "center",
                justifyContent: "center"
            },
            datePickerContainer: {
                width:"50%",
                display: "flex",
                position: "absolute" as "absolute",
                top: 0,
                right: 100,
                visibility: "hidden" as "hidden",
            },
            datePickerinvidualContainer:{
                display: "flex",
                background: "#FFF",
                boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
                height: 40,
                width: "100%",
                paddingLeft: 10,
                cursor: "pointer"
            },
            checkboxStyle:{
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
            },
            labelSwichStyle:{
                ...FONT_FAMILY.Lexend(500,12)
            },
            searchBtnStyle: {
                height: 40,
                backgroundColor: secondColor(500),
            },
        };
    }, [i18next.language, t]);
    return {
        classes,
    };
};
export { useStyle };


