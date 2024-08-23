import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();

  const { t } = useTranslation();

  const classes = useMemo(() => {
    return {
    btnContainer:{
      width: "fit-content",
      height: 40,
      marginBottom: 15,
      backgroundColor:secondColor(500)
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    gap: 20,
    padding:"0px 20px 20px 20px",
    overflowY: "scroll" as "scroll",
  },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
