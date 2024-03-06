import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        position: "relative" as "relative",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
      },
      header: {
        position: "sticky" as "sticky",
        top: 0,
        width: "100%",
        // backgroundColor: '#FFF',
        zIndex: 1,
        padding: 0,
        paddingTop: 20,
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: "rgba(130, 131, 190, 1)",
      },
      insideStyle: {
        paddingLeft: 15,
        paddingTop: 15,
        paddingRight: 0,
        width: "460px",
        height: "384px",
        borderRadius: 16,
      },
      btnStyle: {
        display: "flex",
        position: "fixed" as "fixed",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
