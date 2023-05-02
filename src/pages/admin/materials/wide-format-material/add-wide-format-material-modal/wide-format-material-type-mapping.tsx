import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { SheetSizeMapping } from "./wide-format-material-size-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";
import { WideFormatMatrtialTypeInputs } from "../shared-inputs-widget/wide-format-material-type-inputs";

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
        <WideFormatMatrtialTypeInputs index={index} />
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t(
              "materials.wideFormatMaterial.admin.WideFormatMaterialSizeSection"
            )}
          </div>
          <Tooltip
            title={t(
              "materials.wideFormatMaterial.admin.addWideFormatMaterialSize"
            )}
          >
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
          <Tooltip
            title={t(
              "materials.wideFormatMaterial.admin.removeWideFormatMaterialSize"
            )}
          >
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
              <SheetSizeMapping
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
      </div>
    </>
  );
};
export { SheetWeightsMapping };
