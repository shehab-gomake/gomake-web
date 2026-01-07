import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 24,
      },
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 15,
      },
      switchContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      switchLabel: {
        ...FONT_FAMILY.Inter(700, 14),
        color: "#344054",
      },
      autoCompleteSelectedSectionName: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "flex-end",
        padding: "8px 12px",
        width: 140,
        height: 36,
        border: "1px solid #D0D5DD",
        borderRadius: 8,
        boxShadow: "none",
        backgroundColor: "#FFF",
        color: "#344054",
        ...FONT_FAMILY.Inter(500, 14),
      },
      copyToAnotherProductsButton: {
        width: "fit-content",
        height: "36px",
        borderRadius: "8px",
        padding: "8px 12px",
        ...FONT_FAMILY.Inter(500, 14),
      },
      insideStyle: {
        width: "45%",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      },
      optionsTitle: {
        ...FONT_FAMILY.Inter(500, 16),
        color: "#344054",
      },
      cancelButton: {
        ...FONT_FAMILY.Inter(600, 16),
        width: "50%",
        borderRadius: "8px",
        height: "44px",
        backgroundColor: "#FFFFFF",
        color: "#344054",
        border: "1px solid #D0D5DD",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textTransform: "capitalize" as "capitalize",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
