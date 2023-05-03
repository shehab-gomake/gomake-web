import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { RollEncapsulationSizeMapping } from "./roll-encapsulation-size-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { RollEncapsulationWeightsInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-inputs";

const RollEncapsulationWeightsMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <RollEncapsulationWeightsInputs index={index} />
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
                  ...materialRollEncapsulationStateValue?.items[index][
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
                materialRollEncapsulationStateValue?.changeItems(
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
                  ...materialRollEncapsulationStateValue?.items[index][
                    "rollEncapsulationSizes"
                  ],
                ];
                temp.pop();
                materialRollEncapsulationStateValue?.changeItems(
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
        {materialRollEncapsulationStateValue?.items[index][
          "rollEncapsulationSizes"
        ]?.map((item: any, index2: number) => {
          return (
            <RollEncapsulationSizeMapping
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
      </div>
    </>
  );
};
export { RollEncapsulationWeightsMapping };
