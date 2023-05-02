import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";
import { AddHardboardThicknessMapping } from "./add-hardboard-thicknesses-mapping";

const AddSheetWeightSizeMapping = ({
  index,
  selectedItem,
  hardboardThickness,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialHardboardsStateValue?.items[index][
          "hardboardThicknesses"
        ]?.map((item: any, index2: number) => {
          return (
            <AddHardboardThicknessMapping
              key={`hardboardThicknessMapping_${index2}`}
              index={index2}
              hardboardSizeIndex={index}
              hardboardThickness={
                materialHardboardsStateValue?.items[index][
                  "hardboardThicknesses"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialHardboardsStateValue?.isAddNewHardboardSizeThickness(
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
                materialHardboardsStateValue?.addNewHardboardSizeThicknesByCategoryName(
                  selectedItem?.categoryName,
                  hardboardThickness?.id
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
export { AddSheetWeightSizeMapping };
