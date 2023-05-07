import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { SheetSizeMapping } from "./lamination-thickness-mapping";
import { materialSheetsState } from "../store/lamination";
import { useStyle } from "./style";
import { SheetWeightsInputs } from "../shared-inputs-widget/lamination-size-inputs";

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
            {t("materials.lamination.admin.laminationThicknessSection")}
          </div>
          <Tooltip
            title={t("materials.lamination.admin.addNewLaminationThickness")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialSheetsStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.push({
                  code: "",
                  thickness: "",
                  defaultPrice: "",
                  coldOrHot: "",
                });
                materialSheetsStateValue?.changeItems(
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
                  ...materialSheetsStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.pop();
                materialSheetsStateValue?.changeItems(
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
        {materialSheetsStateValue?.items[index]["laminationThicknesses"]?.map(
          (item: any, index2: number) => {
            return (
              <SheetSizeMapping
                key={`SheetSizeMapping_${index2}`}
                index={index2}
                sheetWeightIndex={index}
                sheetSize={
                  materialSheetsStateValue?.items[index][
                    "laminationThicknesses"
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
