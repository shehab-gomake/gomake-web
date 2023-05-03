import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { AddsheetSizeMapping } from "./add-roll-encapsulation-size-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";

const AddRollEncapsulationWeightSizeMapping = ({
  index,
  selectedItem,
  sheetSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialRollEncapsulationStateValue?.items[index][
          "rollEncapsulationSizes"
        ]?.map((item: any, index2: number) => {
          return (
            <AddsheetSizeMapping
              key={`RollEncapsulationSizeMapping_${index2}`}
              index={index2}
              sheetWeightIndex={index}
              sheetSize={
                materialRollEncapsulationStateValue?.items[index][
                  "rollEncapsulationSizes"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsWightRollEncapsulationContainer}>
          <div style={clasess.addRollEncapsulationBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialRollEncapsulationStateValue?.setIsAddNewRollEncapsulationWightSize(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addRollEncapsulationBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialRollEncapsulationStateValue?.addNewSheeWeightSizeByCategoryName(
                  selectedItem?.categoryName,
                  sheetSize?.id
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
export { AddRollEncapsulationWeightSizeMapping };
