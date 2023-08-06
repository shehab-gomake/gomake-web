import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";

const LaminationSizeMapping = ({
  index,
  sheetSize,
  sheetWeight,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialLaminationStateValue.deleteLaminationweightSize(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          item={sheetSize}
          onClickUpdate={() =>
            materialLaminationStateValue.updateLaminationWeightSizes(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          title={"Delete Lamination Weight Size"}
          subTitle={"Are you sure you want to delete sheet weight size?"}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialLaminationStateValue?.updateState[sheetSize?.id]?.code
              }
              onChange={(e: any) => {
                materialLaminationStateValue?.onChangeUpdateStateLaminationWeights(
                  sheetSize?.id,
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
              value={
                materialLaminationStateValue?.updateState[sheetSize?.id]
                  ?.thickness
              }
              onChange={(e: any) => {
                materialLaminationStateValue?.onChangeUpdateStateLaminationWeights(
                  sheetSize?.id,
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
              value={
                materialLaminationStateValue?.updateState[sheetSize?.id]
                  ?.defaultPrice
              }
              onChange={(e: any) => {
                materialLaminationStateValue?.onChangeUpdateStateLaminationWeights(
                  sheetSize?.id,
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
              value={
                materialLaminationStateValue?.updateState[sheetSize?.id]
                  ?.coldOrHot
              }
              onChange={(e: any) => {
                materialLaminationStateValue?.onChangeUpdateStateLaminationWeights(
                  sheetSize?.id,
                  "coldOrHot",
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
export { LaminationSizeMapping };
