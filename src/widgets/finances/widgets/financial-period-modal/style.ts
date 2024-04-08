import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {  theme,secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "620px",
        borderRadius: 8,
        gap: "8px",
        height: "300px",
        maxHeight: 400,
        backgroundColor: "#f7f7f7",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap:10,
        
      },
      date1FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "55%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      dropDownListStyle: {
        width: 300,
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      btnContainer:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center",
        width: "50%",
        height: 40,
        backgroundColor: secondColor(500),
        marginTop:25,
        marginBottom:10
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
