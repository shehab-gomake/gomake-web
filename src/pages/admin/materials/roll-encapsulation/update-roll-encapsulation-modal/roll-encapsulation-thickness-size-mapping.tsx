import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { useMemo } from "react";

const RollEncapsulationSizeMapping = ({
  index,
  sheetSize,
  sheetWeight,
  selectedItem,
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
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialRollEncapsulationStateValue.deleteRollEncapsulationweightSize(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          item={sheetSize}
          onClickUpdate={() =>
            materialRollEncapsulationStateValue.updateRollEncapsulationWeightSizes(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          title={"Delete RollEncapsulation Weight Size"}
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
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
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
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
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
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
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
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
                  sheetSize?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.defaultPricePerTon")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetPaper.admin.enterDefaultPricePerTon"
              )}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
                  sheetSize?.id,
                  "defaultPricePerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.fitToPrintType")}
            </div>
            <GoMakeAutoComplate
              options={muliSelectOptions}
              style={clasess.multiSelectStyle}
              placeholder={t("materials.lamination.admin.fitToPrintType")}
              multiple
              getOptionLabel={(option: any) => option}
              onChange={(e: any, value: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationWeights(
                  sheetSize?.id,
                  "fitToPrintType",
                  value.map((item: any) => item?.lable)
                );
              }}
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.fitToPrintType
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { RollEncapsulationSizeMapping };
