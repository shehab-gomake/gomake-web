import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const   useStyle = () => {
  const {primaryColor  , theme , grayColor} = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 11,
        cursor: "pointer",
      },
      cardItemWithMore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        backgroundColor: grayColor(100),
        marginBottom: 6,
        borderRadius: 16,
        gap: 5,
      },
      WithBordermainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        backgroundColor: grayColor(100),
        marginBottom: 6,
        borderRadius: 16,
        border: `2px solid ${primaryColor(400)}`,
        gap: 5,
      },
      emptyStyle: { width: 14, height: 24 },
      sortStyle: { cursor: "pointer" },
      moreIconStyle: {
        cursor: "pointer",
        display: "flex",
      },
    };
  }, [theme]);
  return {
    classes,
    primaryColor,
  };
};
export { useStyle };
