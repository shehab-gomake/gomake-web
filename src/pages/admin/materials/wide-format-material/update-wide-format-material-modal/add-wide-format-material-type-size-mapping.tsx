import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { AddsheetSizeMapping } from "./add-wide-format-material-size-mapping";
import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";

const AddWideFormatMaterialWeightSizeMapping = ({
  index,
  selectedItem,
  sheetSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialWideFormatMaterialStateValue?.items[index][
          "wideFormatMaterialSizes"
        ]?.map((item: any, index2: number) => {
          return (
            <AddsheetSizeMapping
              key={`WideFormatMaterialSizeMapping_${index2}`}
              index={index2}
              sheetWeightIndex={index}
              sheetSize={
                materialWideFormatMaterialStateValue?.items[index][
                  "wideFormatMaterialSizes"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsTypeWideFormatMaterialContainer}>
          <div style={clasess.addWideFormatMaterialBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialWideFormatMaterialStateValue?.setIsAddNewWideFormatMaterialTypeSize(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addWideFormatMaterialBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialWideFormatMaterialStateValue?.addNewSheeWeightSizeByCategoryName(
                  selectedItem?.categoryName,
                  sheetSize?.id
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
export { AddWideFormatMaterialWeightSizeMapping };
