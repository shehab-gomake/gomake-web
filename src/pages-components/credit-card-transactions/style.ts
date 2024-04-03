import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { theme, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "hidden" as "hidden",
        marginBottom: "20px",
        gap: 20,
      },
      stackStyle: {
        flexDirection: "column",
        justifyContent: "space-between",
        display: "flex",
        gap: "2px",
        height: "100%",
      },
      insideStyle: {
       // width: "600px",
        height: "300px",
      },
      iconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300)
      }
    };
  }, [theme, t]);
  return {
    classes,
  };
};
export { useStyle };
