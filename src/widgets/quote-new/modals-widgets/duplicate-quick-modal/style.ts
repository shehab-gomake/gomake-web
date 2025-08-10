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
        maxHeight: "600px",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        gap: 24,
        overflowY: "auto" as "auto",
        maxHeight: "400px",
        padding: 5
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
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 3,
        marginTop: 8
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
        width: "30%",
        gap: 6
      },
      groupParameterDropdown2: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "62%",
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
      groupParameterInput2: {
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
      groupParameterAdd2:{
        width: 40,
        height: 40,
      },
      groupParameterAddContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 3
      },
      checkboxContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      checkboxLabel:{
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#101828"
      },
      buttonContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 12,
        width: "100%"
      },
      cancelButton:{
        backgroundColor: "#FFFFFF",
        border: `1px solid #D0D5DD`,
        boxShadow: "0px 1px 2px 0px #1018280D",
        borderRadius: 8,
        height:44,
        color: "#344054",
        ...FONT_FAMILY.Lexend(600, 16)
      },
      addButton:{
        borderRadius: 8,
        height:44,
        color: "#FFFFFF",
        boxShadow: "0px 1px 2px 0px #1018280D",
        ...FONT_FAMILY.Lexend(600, 16),
        width: "100%",
      },
      addButtonContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8
      },
      addButtonText:{
        ...FONT_FAMILY.Lexend(600, 16),
        color: "#FFFFFF",
        marginTop: 6
      }
      
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
