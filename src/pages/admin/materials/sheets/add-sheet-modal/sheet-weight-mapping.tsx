import { useTranslation } from "react-i18next";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { useStyle } from "./style";
import { SheetSizeMapping } from "./sheet-size-mapping";
import { useRecoilValue } from "recoil";
import { materialSheetsState } from "../store/sheets";

const SheetWeightsMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterWeight")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["weight"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "weight",
                  e.target.value
                );
              }}
            />
          </div>
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
                  ...materialSheetsStateValue?.items[index]["sheetSizes"],
                ];
                temp.push({
                  code: "",
                  name: "",
                  width: "",
                  height: "",
                  defaultPricePerTon: "",
                  defaultPricePerUnit: "",
                  direction: "",
                  index: "",
                });
                materialSheetsStateValue?.changeItems(
                  index,
                  "sheetSizes",
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
                  ...materialSheetsStateValue?.items[index]["sheetSizes"],
                ];
                temp.pop();
                materialSheetsStateValue?.changeItems(
                  index,
                  "sheetSizes",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialSheetsStateValue?.items[index]["sheetSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <SheetSizeMapping
                key={`SheetSizeMapping_${index2}`}
                index={index2}
                sheetWeightIndex={index}
                sheetSize={materialSheetsStateValue?.items[index]["sheetSizes"]}
              />
            );
          }
        )}
      </div>
    </>
  );
};
export { SheetWeightsMapping };
