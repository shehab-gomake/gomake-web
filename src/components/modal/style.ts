import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ insideStyle , headerPadding }: any) => {
  const { primaryColor , errorColor , neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "45%",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        height: "90%",
        overFlow: "auto" as "auto",
        paddingTop: convertWidthToVW(25),
        paddingLeft:  convertWidthToVW(20),
        paddingRight: convertWidthToVW(20),
        paddingBottom: convertWidthToVW(20),
        ...insideStyle,
      },
      closeIcon: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        cursor: "pointer" as "pointer",
      },
      titleModalStyle: {
        display: "flex",
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(500, 24),
      },
      titleBlockModalStyle: {
        display: "flex",
        color: errorColor(500),
        ...FONT_FAMILY.Lexend(500, 24),
      },
      boxContainer: {
        height: "100%",
        maxHeight: "100%",
        width: "100%",
        overflowY: "scroll" as "scroll",
      },
      childrenContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
      },
      headerContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: headerPadding,
        paddingLeft: headerPadding
      },
      modalContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "25%",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
      },
      content: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
        width: "80%",
      },
      icon: {
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: 10,
      },
      title: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: primaryColor(500),
        marginBottom: 14,
        textAlign: "center" as "center",
      },
      subTitle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: neutralColor(500),
        textAlign: "center" as "center",
        marginBottom: 33,
        width: "89%",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        width: "100%",
      },
      confermBtn: {
        width: "50%",
        height: 33.29,
        borderRadius: "10px",
        ...FONT_FAMILY.Lexend(500, 9),
        backgroundColor: primaryColor(500),
      },
      cancelBtn: {
        width: "50%",
        height: 33.29,
        borderRadius: "10px",
        ...FONT_FAMILY.Lexend(500, 9),
      },
    };
  }, [insideStyle, headerPadding]);
  return {
    classes,
  };
};
export { useStyle };
