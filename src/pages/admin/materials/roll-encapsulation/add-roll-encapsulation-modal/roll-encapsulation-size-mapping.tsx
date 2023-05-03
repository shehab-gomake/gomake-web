import { useTranslation } from "react-i18next";

import { RollEncapsulationSizeInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-size-inputs";
import { useStyle } from "./style";

const RollEncapsulationSizeMapping = ({
  index,
  sheetWeightIndex,
  sheetSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <RollEncapsulationSizeInputs
          index={index}
          sheetWeightIndex={sheetWeightIndex}
          sheetSize={sheetSize}
        />
      </div>
    </>
  );
};
export { RollEncapsulationSizeMapping };
