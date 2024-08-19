import { useTranslation } from "react-i18next";

import { useStyle } from "./style";


const useSalesReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation()

  return {
    classes, t
  };
};

export { useSalesReportHeader };
