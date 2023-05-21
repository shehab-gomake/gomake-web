import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddAplicationSizesMapping } from "./add-application-size-mapping";
import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const AddApplicationThicknessMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
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
            title={t("materials.applications.admin.removeApplicationThickness")}
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
              <AddAplicationSizesMapping
                key={`AddAplicationSizesMapping_${index2}`}
                index={index2}
                applicationThicknessIndex={index}
                applicationSize={
                  materialApplicationsStateValue?.items[index][
                    "applicationSizes"
                  ]
                }
              />
            );
          }
        )}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialApplicationsStateValue?.setIsAddNewApplicationThickness(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.buttons.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialApplicationsStateValue?.addNewApplicationThicknessByCategoryName(
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
export { AddApplicationThicknessMapping };
