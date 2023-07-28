import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { SheetSizeMapping } from "./sheet-size-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";
import { SheetWeightsInputs } from "../shared-inputs-widget/sheet-weight-inputs";

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
        <SheetWeightsInputs index={index} />
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
