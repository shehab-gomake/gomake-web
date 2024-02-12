import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, warningColor, secondColor, successColor, errorColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      writeCommentcontainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "14px 29px",
        background: "#F4F1F6",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        gap: 12,
      },
      btnContainer: {
        border: "1px solid #D0D5DD",
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: "#FFFFFF",
        color: "#344054",
        ...FONT_FAMILY.Inter(600, 14),
        height: 36,
        width: "fit-content",
        padding: "8px 14px",
        borderRadius: 8,
      },
      btnSecondContainer: {
        border: "1px solid #CBCBE4",
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: "#CBCBE4",
        color: "#252675",
        ...FONT_FAMILY.Inter(600, 14),
        height: 40,
        width: "fit-content",
        padding: "10px",
        borderRadius: 8,
      },
      btnThirdContainer: {
        border: "1px solid #2E3092",
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: "#2E3092",
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: 40,
        width: "fit-content",
        padding: "10px",
        borderRadius: 8,
      },
      btnOrderNowContainer: {
        border: "1px solid #F135A3",
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: "#F135A3",
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: 40,
        width: "fit-content",
        padding: "10px",
        borderRadius: 8,
      },
      insideStyle: {
        width: "800px",
        height: 680,

      },
      statusLabel: {
        color: "#344054",
        ...FONT_FAMILY.Lexend(500, 14),
        width: '100%',
        textTransform: 'capitalize',
        justifyContent: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        backgroundColor: "FFFFFF",
        '&:hover': {
          color: '#FFF',
          backgroundColor: "#344054"
        }
      },

      testStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
      borderRadius: {
        borderRadius: '4px'
      },
      boxStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        height: "100%"
      },
      saveBtn: {
        display: "flex",
        alignSelf: "flex-start",
        width: "80%"
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
