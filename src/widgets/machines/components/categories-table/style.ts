import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom:20
      },
      headerContainer: {
        display: "flex",
        justifyContent: "flex-end" as "flex-end",
        alignItems: "center" as "center",
        margin: "30px 0 25px 0",
        gap: 10,
        width: "100%",

      },
      filterByStatus: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        border: "1px solid #D0D5DD",
        borderRadius: 8,
        padding: "8px 10px",
        backgroundColor: "#FFF",
        color: "#344054",
        ...FONT_FAMILY.Inter(600, 12),
        height: 40,
        cursor: "pointer",
        width: 175,
      },
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: primaryColor(500),
      },
      searchInput: {
        width: 180,
        height: 40,
      },
      addMachineBtn: {
        width: "fit-content",
        marginBottom: 15,
      },
      filterMenuItem: {
        width: "175px",
        ...FONT_FAMILY.Inter(600, 16),
      },
      filterMenuContainer: {
        marginTop: 2,
        marginLeft: 0,
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
