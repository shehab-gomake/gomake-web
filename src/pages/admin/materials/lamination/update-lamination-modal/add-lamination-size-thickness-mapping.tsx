import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { AddsheetSizeMapping } from "./add-lamination-thickness-mapping";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";

const AddLaminationWeightSizeMapping = ({ index, selectedItem, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialLaminationStateValue?.items[index][
          "laminationThicknesses"
        ]?.map((item: any, index2: number) => {
          return (
            <AddsheetSizeMapping
              key={`LaminationSizeMapping_${index2}`}
              index={index2}
              sheetWeightIndex={index}
              sheetSize={
                materialLaminationStateValue?.items[index][
                  "laminationThicknesses"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsWightLaminationContainer}>
          <div style={clasess.addLaminationBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialLaminationStateValue?.setIsAddNewLaminationWightSize(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addLaminationBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialLaminationStateValue?.addNewSheeWeightSizeByCategoryName(
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
export { AddLaminationWeightSizeMapping };
