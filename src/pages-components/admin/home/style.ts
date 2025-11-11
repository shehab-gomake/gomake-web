import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { getHeadingTypography } from "@/utils/typography-utils";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { theme, primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        gap: 16,
        backgroundColor: "var(--theme-bg-body, #F6F6F6)",
        paddingLeft: 20,
        paddingRight: 20,
      },

      firstRowContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        width: "100%",
        gap: 20,
        backgroundColor: "var(--theme-bg-body, #F6F6F6)",
        marginBottom: 15,
      },

      secondRowContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
        gap: 20,
        backgroundColor: "var(--theme-bg-body, #F6F6F6)",
        marginBottom: 15,
      },
      titleStyle: {
        ...getHeadingTypography({
          color: `var(--theme-typography-title-color, ${primaryColor(500)})`,
          fontWeight: 600,
        }),
      },
      containerStyle: {
        display: "grid",
        gridTemplateColumns:
          "var(--theme-home-grid-template-columns, 49.5% 49.5%)",
        gridColumnGap: "var(--theme-home-grid-column-gap, 1%)",
      },

      mobileContainerStyle: {
        display: "flex",
      },

      widgetStyle: {
        height: "100%",
        width: "100%",
      },
      skeltonStyle: {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
      },
    };
  }, [i18next.language, t, theme]);
  return {
    classes,
  };
};
export { useStyle };
