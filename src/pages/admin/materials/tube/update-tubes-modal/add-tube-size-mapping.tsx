import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { materialTubeState } from "../store/tube";
import { useStyle } from "./style";
import { TubeSizeInputs } from "../shared-inputs-widget/tube-size-inputs";

const AddTubeSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <TubeSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialTubeStateValue?.setIsAddNewTubeWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialTubeStateValue?.addNewTubeSizeByCategoryName(
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
export { AddTubeSizeWeightsMapping };
