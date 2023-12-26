import { useStyle } from "./style";
import { useEffect, useState } from "react";
import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { useRouter } from "next/router";

const ProfitHeaderWidget = ({ calculateCaseValue }) => {
  const { clasess } = useStyle();
  const [selectedWorkFlow, setSelectedWorkFlow] = useState<any>();
  const [selectedAction, setSelectedAction] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    if (calculateCaseValue) {
      setSelectedWorkFlow(calculateCaseValue?.productItemValue?.workFlow[0]);
      let temp =
        calculateCaseValue?.productItemValue?.workFlow[0]?.actions.find(
          (action) => action.actionId === router.query.actionId
        );
      setSelectedAction(temp);
    }
  }, [calculateCaseValue, router]);
  return (
    <div style={clasess.mainHeaderContainer}>
      <div style={clasess.firstHeaderContainer}>
        {selectedWorkFlow && (
          <GeneralInformationComponent
            details={selectedWorkFlow?.generalInformation}
          />
        )}
      </div>
      <div style={clasess.secondHeaderContainer}>
        {selectedAction && (
          <GeneralInformationComponent
            details={selectedAction?.outputs}
            withTitle={false}
            actionName={router.query.actionName.toString()}
          />
        )}
      </div>
    </div>
  );
};
export { ProfitHeaderWidget };
