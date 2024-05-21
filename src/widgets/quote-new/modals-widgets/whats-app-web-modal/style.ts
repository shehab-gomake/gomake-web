import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptLeft, adaptRight, leftRightAdapter } from "@/utils/adapter";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "300px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        gap:25,
        position: "relative" as "relative",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 8,
        height: 40,
      },
      btnContainer: {
      
        width: "fit-content",
        height: 40,
        backgroundColor: secondColor(500),
        position: "absolute",
        bottom:0,
        ...adaptLeft(t("direction"), 0),
      },
      sendBtn: {
        width: "30%",
        backgroundColor: secondColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
