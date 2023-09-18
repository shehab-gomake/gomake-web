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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
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
            {t("materials.inputs.width")} (cm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
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
            {t("materials.inputs.height")} (m)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterHeight")}
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
            {t("materials.inputs.defaultPricePerMeterSquare")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerMeterSquare")}
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
            {t("materials.inputs.index")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterIndex")}
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
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.hardboards.inputs.stiffnessFactor")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.hardboards.inputs.stiffnessFactor")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["stiffnessFactor"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItemsWideFormatMaterialSize(
                sheetWeightIndex,
                index,
                "stiffnessFactor",
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
