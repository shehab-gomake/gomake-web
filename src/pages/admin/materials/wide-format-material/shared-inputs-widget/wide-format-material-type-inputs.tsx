import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "../add-wide-format-material-modal/style";

const WideFormatMatrtialTypeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
            style={clasess.textInputStyle}
            value={materialWideFormatMaterialStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.weightPerMeterSquare")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWeightPerMeterSquare")}
            style={clasess.textInputStyle}
            value={
              materialWideFormatMaterialStateValue?.items[index][
                "weightPerMeterSquare"
              ]
            }
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItems(
                index,
                "weightPerMeterSquare",
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
            value={
              materialWideFormatMaterialStateValue?.items[index]["thickness"]
            }
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItems(
                index,
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
              materialWideFormatMaterialStateValue?.items[index]["hardness"]
            }
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItems(
                index,
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
            value={materialWideFormatMaterialStateValue?.items[index]["index"]}
            onChange={(e: any) => {
              materialWideFormatMaterialStateValue?.changeItems(
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
export { WideFormatMatrtialTypeInputs };
