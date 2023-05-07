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
              {t("materials.sheetPaper.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterCode")}
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
              {t("materials.sheetPaper.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterThickness")}
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
              {t("materials.plat.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterDefaultPrice")}
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
              {t("materials.lamination.admin.coldOrHot")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterColdOrHot")}
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
