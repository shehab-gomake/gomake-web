import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddsheetSizeMapping } from "./add-wide-format-material-size-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const AddSheetWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterName")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.wideFormatMaterial.admin.weightPerMeterSquare")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.wideFormatMaterial.admin.enterWeightPerMeterSquare"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetsStateValue?.items[index]["weightPerMeterSquare"]
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "weightPerMeterSquare",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["thickness"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.wideFormatMaterial.admin.hardness")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.wideFormatMaterial.admin.enterHardness"
              )}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["hardness"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "hardness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterIndex")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["index"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "index",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.sheetPaper.admin.sheetSizeSection")}
          </div>
          <Tooltip title={t("materials.sheetPaper.admin.addSheetSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialSheetsStateValue?.items[index][
                    "wideFormatMaterialSizes"
                  ],
                ];
                temp.push({
                  code: "",
                  name: "",
                  width: "",
                  height: "",
                  defaultPricePerMeterSquare: "",
                  index: "",
                });
                materialSheetsStateValue?.changeItems(
                  index,
                  "wideFormatMaterialSizes",
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
                    "wideFormatMaterialSizes"
                  ],
                ];
                temp.pop();
                materialSheetsStateValue?.changeItems(
                  index,
                  "wideFormatMaterialSizes",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialSheetsStateValue?.items[index]["wideFormatMaterialSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <AddsheetSizeMapping
                key={`SheetSizeMapping_${index2}`}
                index={index2}
                sheetWeightIndex={index}
                sheetSize={
                  materialSheetsStateValue?.items[index][
                    "wideFormatMaterialSizes"
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
