import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        gap: 20,
        padding: "0px 20px 20px 20px",
      },
      tableTitleContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 10,
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(700, 14),
        color: primaryColor(500),
        paddingLeft: 5,
      },
      totalStyle: {
        ...FONT_FAMILY.Lexend(700, 14),
        color: primaryColor(500),
        paddingRight: 5,
        display: "flex",
        alignItems: "right",
        justifyContent: "flex-end",
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
      },
      totalWithBalanceStyle: {
        ...FONT_FAMILY.Lexend(700, 14),
        color: primaryColor(500),
        paddingRight: 5,
        display: "flex",
        alignItems: "right",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
      },
      date1FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        // width: "18%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        border: "none",
      },
      balanceInput: {
        width: "100%",
        border: "none",
        height: "30px",
      },
      submitStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        width: "fit-content",
        padding: "0px",
      },
      headerStyle: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        gap: 10,
        justifyContent: "space-between",
        width: "100%",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
