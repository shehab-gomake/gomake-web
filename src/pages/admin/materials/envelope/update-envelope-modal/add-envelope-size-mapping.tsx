import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { materialEnvelopeState } from "../store/envelope";
import { useStyle } from "./style";
import { EnvelopeSizeInputs } from "../shared-inputs-widget/envelope-size-inputs";

const AddEnvelopeSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <EnvelopeSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialEnvelopesStateValue?.setIsAddNewSheetWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialEnvelopesStateValue?.addNewEnvelopeSizeByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.buttons.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddEnvelopeSizeWeightsMapping };
