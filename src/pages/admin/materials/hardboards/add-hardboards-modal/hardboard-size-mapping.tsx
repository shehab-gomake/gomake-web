import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, TextField, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { HardboardThicknessesMapping } from "./hardboard-thickness-mapping";
import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";
import { useCallback, useEffect, useMemo, useState } from "react";

const HardboardSizesMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [fit, setFit] = useState([]);
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
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
          <Tooltip
            title={t("materials.hardboards.admin.removeLaminationThicknes")}
          >
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
            <HardboardThicknessesMapping
              key={`HardboardThicknessesMapping_${index2}`}
              index={index2}
              hardboardSize={index}
              hardboardThicknes={
                materialHardboardsStateValue?.items[index][
                  "hardboardThicknesses"
                ]
              }
            />
          );
        })}
      </div>
    </>
  );
};
export { HardboardSizesMapping };
