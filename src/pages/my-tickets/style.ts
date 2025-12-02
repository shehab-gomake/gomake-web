import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        height: "100%",
        overflowY: "auto" as "auto",
      },
      headerStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        width: "100%",
      },
      title: {
        ...FONT_FAMILY.Lexend(500, 22),
        color: primaryColor(900),
        margin: 0,
      },
      tableContainer: {
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
      },
    };
  }, [i18next.language, t, primaryColor]);
  return {
    classes,
  };
};
export { useStyle };

