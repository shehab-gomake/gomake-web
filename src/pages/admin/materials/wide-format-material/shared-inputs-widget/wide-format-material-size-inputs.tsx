import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "../add-wide-format-material-modal/style";

const WideFormatMaterialsSizeInputs = ({
  index,
  sheetWeightIndex,
  sheetSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <div style={clasess.inputSizesContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterCode")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["code"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
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
            value={sheetSize[index]["name"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
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
            value={sheetSize[index]["width"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
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
            value={sheetSize[index]["height"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.wideFormatMaterial.admin.defaultPricePerMeterSquare")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.wideFormatMaterial.admin.enterDefaultPricePerMeterSquare"
            )}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPricePerMeterSquare"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
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
            value={sheetSize[index]["index"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
                "index",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { WideFormatMaterialsSizeInputs };
