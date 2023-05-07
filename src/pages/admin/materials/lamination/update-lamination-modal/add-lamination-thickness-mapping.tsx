import { useTranslation } from "react-i18next";

import { LaminationSizeInputs } from "../shared-inputs-widget/lamination-thickness-inputs";
import { useStyle } from "./style";

const AddsheetSizeMapping = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <LaminationSizeInputs
          index={index}
          sheetWeightIndex={sheetWeightIndex}
          sheetSize={sheetSize}
        />
      </div>
    </>
  );
};
export { AddsheetSizeMapping };
