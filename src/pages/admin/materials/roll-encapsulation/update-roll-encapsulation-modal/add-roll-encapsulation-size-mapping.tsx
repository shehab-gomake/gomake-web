import { useTranslation } from "react-i18next";

import { RollEncapsulationSizeInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-size-inputs";
import { useStyle } from "./style";

const AddsheetSizeMapping = ({ index, sheetThicknessIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <RollEncapsulationSizeInputs
          index={index}
          sheetThicknessIndex={sheetThicknessIndex}
          sheetSize={sheetSize}
        />
      </div>
    </>
  );
};
export { AddsheetSizeMapping };
