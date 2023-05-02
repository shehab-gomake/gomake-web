import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";

const WideFormatMaterialSizeMapping = ({
  index,
  sheetSize,
  sheetWeight,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialWideFormatMaterialStateValue.deleteWideFormatMaterialweightSize(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          item={sheetSize}
          onClickUpdate={() =>
            materialWideFormatMaterialStateValue.updateWideFormatMaterialWeightSizes(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          title={t(
            "materials.wideFormatMaterial.admin.deleteWideFormatMaterialSize"
          )}
          subTitle={t(
            "materials.wideFormatMaterial.admin.subTitleDeleteSizeModal"
          )}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterName")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.wideFormatMaterial.admin.weightPerMeterSquare")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.wideFormatMaterial.admin.enterWeightPerMeterSquare"
              )}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.defaultPricePerMeterSquare
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "defaultPricePerMeterSquare",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterIndex")}
              style={clasess.textInputStyle}
              value={
                materialWideFormatMaterialStateValue?.updateState[sheetSize?.id]
                  ?.index
              }
              onChange={(e: any) => {
                materialWideFormatMaterialStateValue?.onChangeUpdateStateWideFormatMaterialWeights(
                  sheetSize?.id,
                  "index",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { WideFormatMaterialSizeMapping };
