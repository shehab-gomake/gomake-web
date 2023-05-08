import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddHardboardThicknessMapping } from "./add-hardboard-thicknesses-mapping";
import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";
import { useCallback, useEffect, useMemo, useState } from "react";

const AddHardboardSizeMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHeight")}
              style={clasess.textInputStyle}
              value={materialHardboardsStateValue?.items[index]["height"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItems(
                  index,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={materialHardboardsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItems(
                  index,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWidth")}
              style={clasess.textInputStyle}
              value={materialHardboardsStateValue?.items[index]["width"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItems(
                  index,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.hardboards.admin.hardboardThicknessesSection")}
          </div>
          <Tooltip
            title={t("materials.hardboards.admin.addNewHardboardThicknes")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialHardboardsStateValue?.items[index][
                    "hardboardThicknesses"
                  ],
                ];
                temp.push({
                  code: "",
                  defaultPricePerSquareMeter: "",
                  index: "",
                  name: "",
                  thickness: "",
                });
                materialHardboardsStateValue?.changeItems(
                  index,
                  "hardboardThicknesses",
                  temp
                );
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("materials.hardboards.admin.removeHardboardSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialHardboardsStateValue?.items[index][
                    "hardboardThicknesses"
                  ],
                ];
                temp.pop();
                materialHardboardsStateValue?.changeItems(
                  index,
                  "hardboardThicknesses",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialHardboardsStateValue?.items[index][
          "hardboardThicknesses"
        ]?.map((item: any, index2: number) => {
          return (
            <AddHardboardThicknessMapping
              key={`hardboardThicknessMapping_${index2}`}
              index={index2}
              hardboardSizeIndex={index}
              hardboardThickness={
                materialHardboardsStateValue?.items[index][
                  "hardboardThicknesses"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialHardboardsStateValue?.setIsAddNewHardboardSizes(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialHardboardsStateValue?.addNewHardboardSizeByCategoryName(
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
export { AddHardboardSizeMapping };
