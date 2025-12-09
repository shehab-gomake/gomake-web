import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import {useIsMobile} from "@/hooks/use-responsive";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const isMobile = useIsMobile();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
      },
      insideStyle: {
        width: isMobile ? "80%" : "50%",
        borderRadius: 5,
        height: "600px",
        minHeight: "300px",
        overflow: "scroll",
      },
      modalContentContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        width: "100%",
      },
      scrollableContent: {
        flex: 1,
        overflowY: "auto" as "auto",
        paddingRight: "8px",
        marginRight: "-8px",
      },
      fixedFooter: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        position: "sticky" as "sticky",
        bottom: 0,
        zIndex: 1,
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 25,
      },
      sendBtn: {
        width: "40%",
        height: 40,
        backgroundColor: secondColor(500),
      },
      autoComplateRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 30,
      },
      selectTypeContainer: {
        width: "100%",
      },
      primaryButtonChooseFile: {
        width: "fit-content",
        height: "36px",
      },
      attachmentsContainer: {
        // marginTop: "15px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
