import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddsheetSizeMapping } from "./add-lamination-thickness-mapping";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";
import { LaminationWeightsInputs } from "../shared-inputs-widget/lamination-size-inputs";

const AddLaminationWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <LaminationWeightsInputs index={index} />
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.sheetPaper.admin.sheetSizeSection")}
          </div>

          <Tooltip title={t("materials.lamination.admin.addNewLaminationSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialLaminationStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.push({
                  thickness: "",
                  defaultPrice: "",
                  coldOrHot: "",
                });
                materialLaminationStateValue?.changeItems(
                  index,
                  "laminationThicknesses",
                  temp
                );
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("materials.lamination.admin.removeLaminationSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialLaminationStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.pop();
                materialLaminationStateValue?.changeItems(
                  index,
                  "laminationThicknesses",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
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
                materialLaminationStateValue?.setIsAddNewLaminationWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addLaminationBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialLaminationStateValue?.addNewSheeWeightByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.buttons.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddLaminationWeightsMapping };
