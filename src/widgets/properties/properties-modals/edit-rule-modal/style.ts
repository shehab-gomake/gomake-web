import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptMarginRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: 800,
        borderRadius: 5,
        height: 385,
        padding: 16,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
      },
      rulesContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
        height: 245,
        overflow: "scroll",
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 15,
      },
      sendBtn: {
        width: "25%",
        ...adaptMarginRight(t("direction"), 16),
        backgroundColor: secondColor(500),
        height: 3,
      },
      cancelBtn: {
        width: "25%",
        backgroundColor: "#fff",
        color: secondColor(500),
        border: `1px solid ${secondColor(500)}`,
        height: 3,
      },
      lineStyle: {
        width: "100%",
        backgroundColor: "#EEEEEE",
        border: "1px",
        borderRadius: 2,
        padding: 12,
        ...FONT_FAMILY.Lexend(500, 12),
        display: "flex",
        justifyContent: "space-between",
        gap: 5,
        marginBottom: 10,
      },
      deleteBtn: {
        cursor: "pointer",
      },
      iconsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        gap: 5,
      },
      ruleVlueState: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
      },
      mainContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 8,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
