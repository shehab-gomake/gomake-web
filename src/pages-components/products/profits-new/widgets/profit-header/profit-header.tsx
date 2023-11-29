import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const ProfitHeaderWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainHeaderContainer}>
      <div style={clasess.firstHeaderContainer}></div>
      <div style={clasess.secondHeaderContainer}></div>
    </div>
  );
};
export { ProfitHeaderWidget };
