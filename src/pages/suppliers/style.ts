import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height:"100%",
        overflowY: 'auto' as 'auto',
      },
      headerStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      paginationStyle: {
        display: "flex",
        paddingLeft: 20,
        paddingRight: 20,
        height:'50px',
        flexDirection: "row" as "row",
        justifyContent: "space-between",
      }
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
