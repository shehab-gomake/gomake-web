import { useTranslation } from "react-i18next";

import { useStyle } from "./style";


const useSalesReportHeader = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()

  return {
    clasess, t
  };
};

export { useSalesReportHeader };
