import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialFrameState } from "../store/frame";
import { useStyle } from "./style";
import { FrameSizeInputs } from "../shared-inputs-widget/frame-sizes-inputs";

const AddFrameSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <FrameSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialFrameStateValue?.setIsAddNewFrameWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialFrameStateValue?.addNewFrameSizeByCategoryName(
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
export { AddFrameSizeWeightsMapping };
