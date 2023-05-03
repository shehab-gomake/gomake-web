import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddsheetSizeMapping } from "./add-roll-encapsulation-size-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { RollEncapsulationThicknesssInputs } from "../shared-inputs-widget/roll-encapsulation-thickness-inputs";

const AddRollEncapsulationThicknesssMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <RollEncapsulationThicknesssInputs index={index} />
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.sheetPaper.admin.sheetSizeSection")}
          </div>
          <Tooltip
            title={t("materials.sheetPaper.admin.addRollEncapsulationSize")}
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
            title={t("materials.sheetPaper.admin.removeRollEncapsulationSize")}
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
            <AddsheetSizeMapping
              key={`RollEncapsulationSizeMapping_${index2}`}
              index={index2}
              sheetThicknessIndex={index}
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
                materialRollEncapsulationStateValue?.setIsAddNewRollEncapsulationThickness(
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
                materialRollEncapsulationStateValue?.addNewSheeThicknessByCategoryName(
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
export { AddRollEncapsulationThicknesssMapping };
