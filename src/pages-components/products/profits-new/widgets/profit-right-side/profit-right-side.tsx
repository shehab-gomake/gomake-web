import { useTranslation } from "react-i18next";

import { AccordionTable } from "@/components/tables/accordion-table";

import { useStyle } from "./style";

const ProfitRightSideWidget = () => {
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
    </div>
  );
};
export { ProfitRightSideWidget };
