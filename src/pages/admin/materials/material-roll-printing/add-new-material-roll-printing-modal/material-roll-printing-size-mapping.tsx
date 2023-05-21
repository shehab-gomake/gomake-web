import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { RollPrintingSizeInputs } from "../shared-inputs-widget/material-roll-printing-size-inputs";

const MaterialRollPrintingSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <RollPrintingSizeInputs index={index} />
      </div>
    </>
  );
};
export { MaterialRollPrintingSizeMapping };
