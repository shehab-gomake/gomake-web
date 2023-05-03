import { useTranslation } from "react-i18next";

import { SheetSizeInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-size-inputs";
import { useStyle } from "./style";

const SheetSizeMapping = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <SheetSizeInputs
          index={index}
          sheetWeightIndex={sheetWeightIndex}
          sheetSize={sheetSize}
        />
      </div>
    </>
  );
};
export { SheetSizeMapping };
