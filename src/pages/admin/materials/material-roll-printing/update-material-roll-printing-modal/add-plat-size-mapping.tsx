import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";
import { RollPrintingSizeInputs } from "../shared-inputs-widget/material-roll-printing-size-inputs";

const AddPlatSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <RollPrintingSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPlatsStateValue?.setIsAddNewSheetWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPlatsStateValue?.addNewPlatSizeByCategoryName(
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
export { AddPlatSizeWeightsMapping };
