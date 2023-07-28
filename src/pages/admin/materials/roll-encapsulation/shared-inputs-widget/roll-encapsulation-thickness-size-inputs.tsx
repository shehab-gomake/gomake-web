import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { useMemo } from "react";

const RollEncapsulationSizeInputs = ({
  index,
  sheetThicknessIndex,
  sheetSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );
  const muliSelectOptions = useMemo(() => {
    return [
      { lable: "String1", id: 1 },
      { lable: "String2", id: 2 },
      { lable: "String3", id: 3 },
    ];
  }, []);

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
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
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
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
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
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
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
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPricePerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerSquareMeter")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPricePerSquareMeter"]}
            onChange={(e: any) => {
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
                index,
                "defaultPricePerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.fitToPrintType")}
          </div>
          <GoMakeAutoComplate
            options={muliSelectOptions}
            style={clasess.multiSelectStyle}
            placeholder={t("materials.inputs.fitToPrintType")}
            multiple
            getOptionLabel={(option: any) => option.lable}
            onChange={(e: any, value: any) => {
              materialRollEncapsulationStateValue?.changeItemsRollEncapsulationSize(
                sheetThicknessIndex,
                index,
                "fitToPrintType",
                value.map((item: any) => item?.lable)
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { RollEncapsulationSizeInputs };
