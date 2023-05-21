import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { LaminationSizeMapping } from "./lamination-thickness-mapping";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";
import { LaminationWeightsInputs } from "../shared-inputs-widget/lamination-size-inputs";

const LaminationWeightsMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <LaminationWeightsInputs index={index} />
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.lamination.admin.laminationThicknessSection")}
          </div>
          <Tooltip
            title={t("materials.lamination.admin.addNewLaminationThickness")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialLaminationStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.push({
                  code: "",
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
          <Tooltip
            title={t(
              "materials.lamination.admin.removeLaminationSizeThickness"
            )}
          >
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
            <LaminationSizeMapping
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
      </div>
    </>
  );
};
export { LaminationWeightsMapping };
