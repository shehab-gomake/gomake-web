import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialFoilState } from "../store/foil";
import { useStyle } from "./style";
import { FoilSizeInputs } from "../shared-inputs-widget/foil-sizes-inputs";

const AddFoilSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <FoilSizeInputs index={index} />
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialFoilStateValue?.setIsAddNewFoilWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialFoilStateValue?.addNewFoilSizeByCategoryName(
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
export { AddFoilSizeWeightsMapping };
