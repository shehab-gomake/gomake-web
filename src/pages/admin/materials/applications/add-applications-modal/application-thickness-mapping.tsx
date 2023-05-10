import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { ApplicationSizesMapping } from "./application-sizes-mapping";
import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const ApplicationThicknessMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
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
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={materialApplicationsStateValue?.items[index]["code"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItems(
                  index,
                  "code",
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
              value={materialApplicationsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItems(
                  index,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterThickness")}
              style={clasess.textInputStyle}
              value={materialApplicationsStateValue?.items[index]["thickness"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItems(
                  index,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeightPerSquareMeter")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.items[index][
                  "weightPerSquareMeter"
                ]
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItems(
                  index,
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.applications.admin.applicationSizesSection")}
          </div>
          <Tooltip
            title={t("materials.applications.admin.addNewApplicationSize")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialApplicationsStateValue?.items[index][
                    "applicationSizes"
                  ],
                ];
                temp.push({
                  code: "",
                  defaultPricePerSquareMeter: "",
                  height: "",
                  name: "",
                  width: "",
                });
                materialApplicationsStateValue?.changeItems(
                  index,
                  "applicationSizes",
                  temp
                );
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t("materials.applications.admin.removeApplicationSize")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialApplicationsStateValue?.items[index][
                    "applicationSizes"
                  ],
                ];
                temp.pop();
                materialApplicationsStateValue?.changeItems(
                  index,
                  "applicationSizes",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialApplicationsStateValue?.items[index]["applicationSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <ApplicationSizesMapping
                key={`ApplicationSizesMapping_${index2}`}
                index={index2}
                applicationThickness={index}
                applicationsize={
                  materialApplicationsStateValue?.items[index][
                    "applicationSizes"
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
export { ApplicationThicknessMapping };
