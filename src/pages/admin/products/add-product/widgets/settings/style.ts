import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      categoryNameStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
        marginBottom: 16,
      },
      firstContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
        width: "100%",
        flexWrap: "wrap" as "wrap",
        marginBottom: 24,
      },
      itemOnFirstContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "180px",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
      },
      selectColorStyle: {
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px solid #000000",
        alignSelf: "flex-end",
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      multiSelectStyle: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: "100%",
        borderRadius: 4,
        display: "flex",
        border: "0px",
        flexDirection: "row" as "row",
        alignitems: "center",
        justifyContent: "center",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      labelTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      requierdInput: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
