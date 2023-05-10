import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialCanvasFramesState } from "../store/canvas-frames";
import { useStyle } from "./style";
import { CanvasFrameSizeInputs } from "../shared-inputs-widget/canvas-frame-sizes-inputs";

const AddCanvasFrameSizeMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <CanvasFrameSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialCanvasFramesStateValue?.setIsAddNewCanvasFrameWights(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialCanvasFramesStateValue?.addNewCanvasFrameSizeByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              ``
              {t("materials.buttons.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddCanvasFrameSizeMapping };
