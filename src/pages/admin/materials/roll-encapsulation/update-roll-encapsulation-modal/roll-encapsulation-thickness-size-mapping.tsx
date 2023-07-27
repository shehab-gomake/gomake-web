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
  sheetThickness,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );
  const muliSelectOptions = useMemo(() => {
    return [
      { label: "String1", id: "String1" },
      { label: "String2", id: "String2" },
      { label: "String3", id: "String3" },
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
              sheetThickness?.id,
              sheetSize?.id
            )
          }
          item={sheetSize}
          onClickUpdate={() =>
            materialRollEncapsulationStateValue.updateRollEncapsulationThicknessSizes(
              selectedItem?.categoryName,
              sheetThickness?.id,
              sheetSize?.id
            )
          }
          title={"Delete RollEncapsulation Thickness Size"}
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
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
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
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.height")} (cm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.defaultPricePerTon")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerTon")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[sheetSize?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
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
              multiple={true}
              onChange={(e: any, value: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  sheetSize?.id,
                  "fitToPrintType",
                  value?.map((item: any) => item?.label)
                );
              }}
              {...(materialRollEncapsulationStateValue?.updateState[
                sheetSize?.id
              ]?.fitToPrintType
                ? {
                    value: materialRollEncapsulationStateValue?.updateState[
                      sheetSize?.id
                    ]?.fitToPrintType.map((item: any) => {
                      return {
                        label: item,
                        id: item,
                      };
                    }),
                  }
                : null)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { RollEncapsulationSizeMapping };
