import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0px 4px 3px 0px rgba(0, 0, 0, 0.03)",
        gap: 30,
      },
      autoComplateRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 30,
      },
      selectCustomerContainer: {
        width: "100%",
        border: `1px solid ${secondColor(300)}`,
        borderRadius: "4px",
        height: 40,
        display: "flex",
        alignItems: "center" as "center",
      },
      selectTypeContainer: {
        width: "100%",
        border: `1px solid ${secondColor(300)}`,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
