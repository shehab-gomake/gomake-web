import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "60%",
        borderRadius: 5,
        height: "fit-content",
        maxHeight: "500px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        gap: 24
      },
      groupContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 24
      },
      groupActions: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 3,
      },
      groupTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#344054"
      },
      groupAction: {
        cursor: "pointer",
      },
      groupParameter: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 8
      },
      groupParameterDropdown: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "44%",
        gap: 6
      },
      groupParameterInput: {
        width: "100%",
        height: 40,
        borderRadius: 8,
        border: `1px solid #D0D5DD`,
        backgroundColor: "transparent",
        boxShadow:"none"
      },
      groupParameterAdd:{
        width: 40,
        height: 40,
        cursor: "pointer",
      },
      groupParameterAddContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 3
      }
      
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
