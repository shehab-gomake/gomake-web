import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useStyle } from "./style";
import { RollPrintingSizeInputs } from "../shared-inputs-widget/material-roll-printing-size-inputs";

const AddMaterialRollPrintingSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <RollPrintingSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialMaterialRollPrintingStateValue?.setIsAddNewMaterialRollPrintingWights(
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
                materialMaterialRollPrintingStateValue?.addNewMaterialRollPrintingSizeByCategoryName(
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
export { AddMaterialRollPrintingSizeWeightsMapping };
