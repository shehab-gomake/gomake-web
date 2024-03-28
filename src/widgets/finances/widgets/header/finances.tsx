import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";

const FinancesHeaderWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerContainer}>
        <div>
          <GomakePrimaryButton style={clasess.downloadBtnStyle}>Download Account files</GomakePrimaryButton>
        </div>
        <div style={clasess.titleStyle}>Accounting Definitions</div>
      </div>
      <div style={clasess.dividerStyle} />
    </div>
  );
};
export { FinancesHeaderWidget };
