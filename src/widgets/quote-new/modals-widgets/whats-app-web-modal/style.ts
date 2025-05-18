import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptLeft } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "310px",
      },
      modalTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        // color: "#000000",
        paddingBottom: "10px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        gap: 25,
        position: "relative" as "relative",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 8,
        border: "1px solid gray",
        height: 40,
      },
      btnContainer: {
        width: "fit-content",
        height: 40,
        position: "absolute" as "absolute",
        bottom: 0,
        ...adaptLeft(t("direction"), 0),
      },
      sendBtn: {
        width: "30%",
        backgroundColor: secondColor(500),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
