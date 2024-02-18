import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "auto",
        borderRadius: 8,
        height: "auto",
        maxHeight: 500,
        minHeight:200,
        backgroundColor: "#F6F6F6",
      },
      textInputStyle: {
        display: "flex",
        width: "100%",
        height: "40px",
        borderRadius: 4,
      },
      mainInputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 25,
        width: "100%",
        height: "100%",
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
      },
      addBtnStyle: {
        width: "50%",
        height: 40,
      },
      errorlabelStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: errorColor(500),
        marginTop: 5,
      },
      modalMainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        gap:10,
        padding:10
      },
      productMappingContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width:"100%",
        gap:15
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
