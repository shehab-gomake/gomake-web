import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddsheetSizeMapping } from "./add-roll-encapsulation-size-mapping";
import { materialSheetsState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { SheetWeightsInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-inputs";

const AddSheetWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <SheetWeightsInputs index={index} />
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.sheetPaper.admin.sheetSizeSection")}
          </div>
          <Tooltip title={t("materials.sheetPaper.admin.addSheetSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialSheetsStateValue?.items[index][
                    "rollEncapsulationSizes"
                  ],
                ];
                temp.push({
                  code: "",
                  width: "",
                  height: "",
                  name: "",
                  defaultPricePerSquareMeter: "",
                  fitToPrintType: [],
                });
                materialSheetsStateValue?.changeItems(
                  index,
                  "rollEncapsulationSizes",
                  temp
                );
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("materials.sheetPaper.admin.removeSheetSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialSheetsStateValue?.items[index][
                    "rollEncapsulationSizes"
                  ],
                ];
                temp.pop();
                materialSheetsStateValue?.changeItems(
                  index,
                  "rollEncapsulationSizes",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialSheetsStateValue?.items[index]["rollEncapsulationSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <AddsheetSizeMapping
                key={`SheetSizeMapping_${index2}`}
                index={index2}
                sheetWeightIndex={index}
                sheetSize={
                  materialSheetsStateValue?.items[index][
                    "rollEncapsulationSizes"
                  ]
                }
              />
            );
          }
        )}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetsStateValue?.setIsAddNewSheetWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialSheetsStateValue?.addNewSheeWeightByCategoryName(
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
export { AddSheetWeightsMapping };
