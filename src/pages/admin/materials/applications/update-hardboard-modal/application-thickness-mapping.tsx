import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { ApplicationSizeesMapping } from "./application-size-mapping";
import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddApplicationThicknessSizeMapping } from "./add-hardboard-size-thickness-mapping";

const ApplicationThicknessMapping = ({ index, item, selectedItem }) => {
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
        <ControlIconsWidget
          t={t}
          item={item}
          onClickDelete={() =>
            materialApplicationsStateValue.deleteApplicationThickness(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialApplicationsStateValue.updateApplicationThickness(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t(
            "materials.applications.admin.deleteApplicationThicknessTitle"
          )}
          subTitle={t(
            "materials.applications.admin.deleteApplicationThicknessSubTitle"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[item?.id]?.code
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  item?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterName")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[item?.id]?.name
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[item?.id]?.thickness
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  item?.id,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.applications.admin.enterWeightPerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  item?.id,
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
              onClick={() =>
                materialApplicationsStateValue.onClickOpenHardboardSizeThicknessWidget(
                  item
                )
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        {materialApplicationsStateValue?.isAddNeApplicationThicknessSize &&
          materialApplicationsStateValue?.selecteApplicationThicknessSize.id ===
            item?.id && (
            <AddApplicationThicknessSizeMapping
              key={`AddApplicationThicknessSizeMapping_${item?.id}`}
              index={0}
              selectedItem={selectedItem}
              applicationSize={item}
            />
          )}
        {item?.applicationSizes?.map((item2: any, index2: number) => {
          return (
            <ApplicationSizeesMapping
              key={`ApplicationSizeesMapping_${index2}`}
              index={index2}
              applicationThickness={item}
              applicationSize={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { ApplicationThicknessMapping };
