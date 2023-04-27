import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";

const LaminationThicknessesMapping = ({
  index,
  laminationThicknes,
  laminationSize,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialLaminationsStateValue.deletelLaminationSizeThickness(
              selectedItem?.categoryName,
              laminationThicknes?.id,
              laminationSize?.id
            )
          }
          item={laminationThicknes}
          onClickUpdate={() =>
            materialLaminationsStateValue.updateLaminationSizeThickness(
              selectedItem?.categoryName,
              laminationThicknes?.id,
              laminationSize?.id
            )
          }
          title={t(
            "materials.lamination.admin.deleteLaminationSizetTicknessTitle"
          )}
          subTitle={t(
            "materials.lamination.admin.deleteLaminationSizethicknessSubTitle"
          )}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialLaminationsStateValue?.updateState[
                  laminationThicknes?.id
                ]?.code
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
                  laminationThicknes?.id,
                  "code",
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
                materialLaminationsStateValue?.updateState[
                  laminationThicknes?.id
                ]?.coldOrHot
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
                  laminationThicknes?.id,
                  "coldOrHot",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterDefaultPrice")}
              style={clasess.textInputStyle}
              value={
                materialLaminationsStateValue?.updateState[
                  laminationThicknes?.id
                ]?.defaultPrice
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
                  laminationThicknes?.id,
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={
                materialLaminationsStateValue?.updateState[
                  laminationThicknes?.id
                ]?.thickness
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
                  laminationThicknes?.id,
                  "thickness",
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
export { LaminationThicknessesMapping };
