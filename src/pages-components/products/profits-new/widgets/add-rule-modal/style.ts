import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "50%",
        borderRadius: 5,
        height: "auto",
        maxHeight: 750,
      },
      textInputStyle: {
        borderRadius: 4,
        height: 40,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 50,
      },
      sendBtn: {
        width: "10%",
        marginLeft: "5%",
        backgroundColor: secondColor(500),
        height: 20,
        padding: 20,
      },
      inputLable: {
        paddingBottom: "10%",
        fontSize: 14,
      },
      inputsContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        gap: 15,
      },
      textarea: {
        width: "100%",
        height: 200,
        padding: 8,
        resize: "none" as "none",
        ...FONT_FAMILY.Lexend(500, 12),
        borderRadius: 4,
      },
      dropDownListContainer: {
        width: 240,
        alignSelf: "center",
        border: "none",
        height: 40,
        marginTop: 2,
      },
      textInputContainer: {
        border: "none",
        height: 40,
        marginTop: 2,
      },
      valueContainer: {
        width: "20%",
        marginTop: "2%",
      },
      spanAddNewRule: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(500),
        fontSize: 15,
        marginLeft: 10,
      },
      spanRemoveRule: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: secondColor(500),
        fontSize: 15,
        marginLeft: 10,
      },
      AddNewRuleDiv: {
        marginTop: "2%",
        marginBottom: "2%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      },
      removeIcon: {
        color: secondColor(500),
        border: "1px solid rgb(237, 2, 140)",
        borderRadius: 4,
        padding: 1,
        height: 15,
        width: 15,
      },
      selectTypeStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 14),
        marginBottom: 8,
        width: "100%",
      },
      autoComplateStyle: {
        border: `none`,
      },
      spanUnitStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        marginLeft: 6,
        marginTop: 4,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
function primaryColor(arg0: number): any {
  throw new Error("Function not implemented.");
}
