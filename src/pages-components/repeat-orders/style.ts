import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { leftRightAdapter } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      pageContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "hidden" as "hidden",
      },
      headerContainer: {
        flexShrink: 0,
        paddingLeft: "20px",
        paddingRight: "20px",
      },
      filtersContainer: {
        flexShrink: 0,
        paddingLeft: "20px",
        paddingRight: "20px",
        marginBottom: "10px",
      },
      scrollableContainer: {
        flex: 1,
        overflowY: "auto" as "auto",
        overflowX: "hidden" as "hidden",
        minHeight: 0,
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "4px",
        paddingBottom: "4px",
      },
      paginationContainer: {
        flexShrink: 0,
      },

      searchInputStyle: {
        borderRadius: "4px",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08);",
        width: "100%",
        border: "none",
        height: "40px",
        marginRight: "0px",
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 10),
      },
    };
  }, [theme]);

  return {
    classes,
  };
};

export { useStyle };
