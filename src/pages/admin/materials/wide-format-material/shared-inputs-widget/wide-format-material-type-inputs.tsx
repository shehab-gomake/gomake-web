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
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterName")}
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
            {t("materials.wideFormatMaterial.admin.weightPerMeterSquare")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.wideFormatMaterial.admin.enterWeightPerMeterSquare"
            )}
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
            {t("materials.sheetPaper.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterThickness")}
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
            {t("materials.wideFormatMaterial.admin.hardness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.wideFormatMaterial.admin.enterHardness")}
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
            {t("materials.sheetPaper.admin.index")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterIndex")}
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
