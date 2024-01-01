import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "50%",
        height: "auto",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#FFFFFF",
        margin: "0 4px",
        borderRadius: 8,
        // boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.08)",
        boxShadow:
          "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
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
        // border: `1px solid ${secondColor(300)}`,
        borderRadius: "4px",
        height: 40,
        display: "flex",
        alignItems: "center" as "center",
      },
      selectTypeContainer: {
        width: "100%",
        // border: `1px solid ${secondColor(300)}`,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
      },
      btnStyle: {
        height: 40,
      },
      errorMsgStyle: {
        padding: 10,
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
