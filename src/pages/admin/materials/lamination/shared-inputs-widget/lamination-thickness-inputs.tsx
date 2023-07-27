import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";

const LaminationSizeInputs = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
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
              materialLaminationStateValue?.changeItemsLaminationSize(
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
            {t("materials.inputs.thickness")} (µm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterThickness")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["thickness"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItemsLaminationSize(
                sheetWeightIndex,
                index,
                "thickness",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPrice")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPrice")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItemsLaminationSize(
                sheetWeightIndex,
                index,
                "defaultPrice",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.coldOrHot")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.coldOrHot")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["coldOrHot"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItemsLaminationSize(
                sheetWeightIndex,
                index,
                "coldOrHot",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { LaminationSizeInputs };
