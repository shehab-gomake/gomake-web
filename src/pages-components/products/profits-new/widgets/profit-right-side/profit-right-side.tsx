import { useTranslation } from "react-i18next";

import { AccordionTable } from "@/components/tables/accordion-table";

import { useStyle } from "./style";
import { MinimumWidget } from "../minimum-widget";
import { ProfitRightSideProps } from "../../interface";

const ProfitRightSideWidget = ({
  minimumValue,
  isUpdateMinimumValue,
  onBlurMinimumValue,
  setIsUpdateMinimumValue,
  onInputChangeMinimumValue,
}: ProfitRightSideProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainHeaderContainer}>
      <AccordionTable title="Pricing Tables" isDefault={true}>
        <div>children</div>
        <div>children</div>
      </AccordionTable>
      <AccordionTable title="Additions and Exceptions">
        <div>children</div>
        <div>children</div>
      </AccordionTable>
      <MinimumWidget
        minimumValue={minimumValue}
        isUpdateMinimumValue={isUpdateMinimumValue}
        onBlurMinimumValue={onBlurMinimumValue}
        setIsUpdateMinimumValue={setIsUpdateMinimumValue}
        onInputChangeMinimumValue={onInputChangeMinimumValue}
      />
    </div>
  );
};
export { ProfitRightSideWidget };
