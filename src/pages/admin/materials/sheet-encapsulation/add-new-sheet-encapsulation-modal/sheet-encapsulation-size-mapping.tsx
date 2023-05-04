import { useTranslation } from "react-i18next";

import { SheetEncapsulationSizeInputs } from "../shared-inputs-widget/sheet-encapsulation-sizes-inputs";
import { useStyle } from "./style";

const SheetEncapsulationSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <SheetEncapsulationSizeInputs index={index} />
      </div>
    </>
  );
};
export { SheetEncapsulationSizeMapping };
