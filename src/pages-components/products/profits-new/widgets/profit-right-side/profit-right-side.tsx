import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const ProfitRightSideWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainHeaderContainer}>
      <></>
    </div>
  );
};
export { ProfitRightSideWidget };
