import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useStyle } from "./style";
import { SheetEncapsulationSizeInputs } from "../shared-inputs-widget/sheet-encapsulation-sizes-inputs";

const AddSheetEncapsulationSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <SheetEncapsulationSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetEncapsulationStateValue?.setIsAddNewSheetEncapsulationWights(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetEncapsulationStateValue?.addNewSheetEncapsulationSizeByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.sheetPaper.admin.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddSheetEncapsulationSizeWeightsMapping };
