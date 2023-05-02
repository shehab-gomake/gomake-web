import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddsheetSizeMapping } from "./add-wide-format-material-size-mapping";
import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";
import { WideFormatMatrtialTypeInputs } from "../shared-inputs-widget/wide-format-material-type-inputs";

const AddWideFormatMaterialWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
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
                  ...materialWideFormatMaterialStateValue?.items[index][
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
                materialWideFormatMaterialStateValue?.changeItems(
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
                  ...materialWideFormatMaterialStateValue?.items[index][
                    "wideFormatMaterialSizes"
                  ],
                ];
                temp.pop();
                materialWideFormatMaterialStateValue?.changeItems(
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
        {materialWideFormatMaterialStateValue?.items[index][
          "wideFormatMaterialSizes"
        ]?.map((item: any, index2: number) => {
          return (
            <AddsheetSizeMapping
              key={`WideFormatMaterialSizeMapping_${index2}`}
              index={index2}
              sheetWeightIndex={index}
              sheetSize={
                materialWideFormatMaterialStateValue?.items[index][
                  "wideFormatMaterialSizes"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsTypeWideFormatMaterialContainer}>
          <div style={clasess.addWideFormatMaterialBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialWideFormatMaterialStateValue?.setIsAddNewWideFormatMaterialType(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addWideFormatMaterialBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialWideFormatMaterialStateValue?.addNewSheeWeightByCategoryName(
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
export { AddWideFormatMaterialWeightsMapping };
