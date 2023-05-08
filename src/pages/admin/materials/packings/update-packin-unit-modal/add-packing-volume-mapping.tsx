import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialPackingsState } from "../store/packings";
import { useStyle } from "./style";
import { PackingVolumnInputs } from "../shared-inputs-widget/packin-volumns-inputs";

const AddPackingVolumeMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <PackingVolumnInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPackingsStateValue?.setIsAddNewPackingVolume(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPackingsStateValue?.addNewPackingVolumeByCategoryName(
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
export { AddPackingVolumeMapping };
