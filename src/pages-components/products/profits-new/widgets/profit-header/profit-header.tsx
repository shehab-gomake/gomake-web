import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const ProfitHeaderWidget = ({ calculateCaseValue }) => {
  console.log("calculateCaseValue", calculateCaseValue);
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainHeaderContainer}>
      <div style={clasess.firstHeaderContainer}>
        {/* {selectedWorkFlow && (
        <GeneralInformationComponent
          details={selectedWorkFlow?.generalInformation}
        />
      )} */}
      </div>
      <div style={clasess.secondHeaderContainer}></div>
    </div>
  );
};
export { ProfitHeaderWidget };
