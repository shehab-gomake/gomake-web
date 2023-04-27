import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { AddsheetSizeMapping } from "./add-sheet-size-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const AddSheetWeightSizeMapping = ({ index, selectedItem, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialSheetsStateValue?.items[index]["sheetSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <AddsheetSizeMapping
                key={`SheetSizeMapping_${index2}`}
                index={index2}
                sheetWeightIndex={index}
                sheetSize={materialSheetsStateValue?.items[index]["sheetSizes"]}
              />
            );
          }
        )}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetsStateValue?.setIsAddNewSheetWightSize(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetsStateValue?.addNewSheeWeightSizeByCategoryName(
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
export { AddSheetWeightSizeMapping };
