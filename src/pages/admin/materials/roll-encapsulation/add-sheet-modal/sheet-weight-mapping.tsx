import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
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
            {t(
              "materials.encapsulationRoll.admin.rollEncapsulationSizeSection"
            )}
          </div>
          <Tooltip
            title={t(
              "materials.encapsulationRoll.admin.addRollEncapsulationize"
            )}
          >
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
          <Tooltip
            title={t(
              "materials.encapsulationRoll.admin.removeRollEncapsulationSize"
            )}
          >
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
              <SheetSizeMapping
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
      </div>
    </>
  );
};
export { SheetWeightsMapping };
