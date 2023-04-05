import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ insideStyle }: any) => {
  const { primaryColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "45%",
        borderRadius: 16,
        backgroundColor: "#fff",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        height: "80%",
        overFlow: "auto" as "auto",
        paddingTop: convertWidthToVW(25),
        paddingLeft: convertWidthToVW(32),
        paddingRight: convertWidthToVW(20),
        paddingBottom: convertWidthToVW(20),
        ...insideStyle,
      },
      closeIcon: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute" as "absolute",
        right: "20px",
        top: "25px",
        cursor: "pointer" as "pointer",
      },
      titleModalStyle: {
        display: "flex",
        color: primaryColor(500),
        marginBottom: convertWidthToVW(24),
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
    };
  }, [insideStyle]);
  return {
    clasess,
  };
};
export { useStyle };
