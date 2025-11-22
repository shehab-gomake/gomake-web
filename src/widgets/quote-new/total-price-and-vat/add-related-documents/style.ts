import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      dialogStyles: {
        paper: {
          width: 420,
          maxWidth: "90vw",
          borderRadius: 12,
        },
        content: {
          backgroundColor: "#FFFFFF",
        },
      },
      inputsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 24,
        marginTop: 12,
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 8,
        height: 44,
        border: "0px",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 8,
        height: 44,
      },
      addNewBtnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      },
      addBtnStyle: {
        height: 44,
        backgroundColor: secondColor(500),
        width: "60%",
      },
    };
  }, [secondColor]);
  return {
    clasess,
  };
};
export { useStyle };
