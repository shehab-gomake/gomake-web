import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: 'row'as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:15,
        width:"100%",
        marginBottom:15
      },
      inputContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:5
      },
      inputLabel:{
        ...FONT_FAMILY.Lexend(600,12)
      },
      dropDownListStyle: {
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
        width: 200,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
