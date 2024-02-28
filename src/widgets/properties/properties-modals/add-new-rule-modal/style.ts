import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "67%",
        borderRadius: 5,
        height: "80%",
        ...FONT_FAMILY.Lexend(500, 12),
      },
      textInputStyle: {
        borderRadius: 4,
        height: 40,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        
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
        height:20,
        padding: 20
      },
      inputLable: {
        paddingBottom: "10%",
        fontSize: 14
      },
      inputsContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10
      },
      textarea: {
        width: "100%",
        height: 200,
        padding: 8,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        resize: "none" as "none",
        ...FONT_FAMILY.Lexend(500, 12),
        borderRadius: 4,
      },
      dropDownListContainer: {
        width: 240,
        alignSelf: "center",
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        border: "none",
        height: 40,
        marginTop: 2
      },
      valueContainer: {
        width: "20%",
        marginTop: "2%"
      },
      spanAddNewRule: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(500),
        fontSize: 15,
        marginLeft:10,
      },
      spanRemoveRule: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: secondColor(500),
        fontSize: 15,
        marginLeft:10,
      },
      AddNewRuleDiv:{
        marginTop: "2%",
        marginBottom:"2%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
      },
      removeIcon:{
        color:secondColor(500),
        border:"1px solid rgb(237, 2, 140)",
        borderRadius:4,
        padding:1,
        height:15,
        width:15
      }

    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };

