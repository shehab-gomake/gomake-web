import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { WideFormatMaterialsSizeInputs } from "../shared-inputs-widget/wide-format-material-size-inputs";

const AddsheetSizeMapping = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <WideFormatMaterialsSizeInputs
          index={index}
          sheetWeightIndex={sheetWeightIndex}
          sheetSize={sheetSize}
        />
      </div>
    </>
  );
};
export { AddsheetSizeMapping };
