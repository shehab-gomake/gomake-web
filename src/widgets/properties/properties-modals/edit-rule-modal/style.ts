import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 800,
        borderRadius: 5,
        height: 385,
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
        marginLeft: "5%",
        backgroundColor: secondColor(500),
        height: 3,
      },
      cancelBtn: {
        width: "25%",
        backgroundColor: "#fff",
        color: secondColor(500),
        border: "1px solid rgb(237, 2, 140)",
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
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
