import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "fit-content",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "30px",
      },
      titleContainer: {
        ...FONT_FAMILY.Lexend(700, 17),
        // marginTop: 15,
        color: "#2E3092",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 8,
        flexWrap: "wrap" as "wrap",
        marginBottom: "5px",
      },
      btnStyle: {
        maxWidth: "20%",
        minWidth: "fit-content",
        height: 40,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
