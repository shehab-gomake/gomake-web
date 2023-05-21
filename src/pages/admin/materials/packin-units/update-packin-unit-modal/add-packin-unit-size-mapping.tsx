import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialPackinUnitsState } from "../store/packin-units";
import { useStyle } from "./style";
import { PackinUnitSizeInputs } from "../shared-inputs-widget/packin-unit-sizes-inputs";

const AddPackinUnitSizeMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <PackinUnitSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPackinUnitsStateValue?.setIsAddNewPackinUnitSize(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPackinUnitsStateValue?.addNewPackinUnitSizeByCategoryName(
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
export { AddPackinUnitSizeMapping };
