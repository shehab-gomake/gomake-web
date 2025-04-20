import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, primaryColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        padding: "10px 21px 10px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        border: "1px solid #F8F9FA",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "16px",
      },
      button: {
        width: "fit-content",
        minWidth: "134px",
        height: "44px",
        borderRadius: "10px",
        color: primaryColor(500),
        borderColor: primaryColor(500),
      },
      lateButton: {
        width: "134px",
        height: "40px",
        borderRadius: "10px",
        color: errorColor(500),
        borderColor: errorColor(500),
      },
      activeButton: {
        width: "134px",
        height: "44px",
        borderColor: primaryColor(500),
        borderRadius: "10px",
      },
      machinesWrapper: {
        alignSelf: "flex-end",
        marginRight: "auto" as "auto",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
