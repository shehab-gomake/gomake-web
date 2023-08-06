import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { ControlIconsWidget } from "./control-icons-widget";
import { WideFormatMaterialSizeMapping } from "./wide-format-material-size-mapping";
import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";
import { AddWideFormatMaterialWeightSizeMapping } from "./add-wide-format-material-type-size-mapping";

const WideFormatMaterialWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
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
            materialWideFormatMaterialStateValue.deleteWideFormatMaterialweight(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialWideFormatMaterialStateValue.updateWideFormatMaterialweight(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t(
            "materials.wideFormatMaterial.admin.deleteWideFormatMaterialType"
          )}
          subTitle={t(
            "materials.wideFormatMaterial.admin.subTitleDeleteTypeModal"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.type")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.type")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[item?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weight")} (m^2)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.weight")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[item?.id]
                  ?.weightPerMeterSquare
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  item?.id,
                  "weightPerMeterSquare",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.thickness")} (µm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterThickness")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[item?.id]
                  ?.thickness
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  item?.id,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.hardness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHardness")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[item?.id]
                  ?.hardness
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  item?.id,
                  "hardness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterIndex")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[item?.id]
                  ?.index
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  item?.id,
                  "index",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
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
              onClick={() =>
                materialWideFormatMaterialStateValue.onClickOpenWideFormatMaterialWeightSizeWidget(
                  item
                )
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialWideFormatMaterialStateValue?.isAddNewWideFormatMaterialTypeSize &&
          materialWideFormatMaterialStateValue
            ?.selectedWideFormatMaterialWeightSize.id === item?.id && (
            <AddWideFormatMaterialWeightSizeMapping
              key={`WideFormatMaterialSizeMapping_${item?.id}`}
              index={0}
              sheetSize={item}
              selectedItem={selectedItem}
            />
          )}
        {item?.wideFormatMaterialSizes?.map((item2: any, index2: number) => {
          return (
            <WideFormatMaterialSizeMapping
              key={`WideFormatMaterialSizeMapping_${index2}`}
              index={index2}
              sheetWeight={item}
              sheetSize={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { WideFormatMaterialWeightsMapping };
