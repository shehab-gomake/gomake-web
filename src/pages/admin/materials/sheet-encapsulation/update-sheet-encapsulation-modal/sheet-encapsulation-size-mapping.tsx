import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useStyle } from "./style";

const SheetEncapsulationWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );
  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <ControlIconsWidget
          t={t}
          item={item}
          onClickDelete={() =>
            materialSheetEncapsulationStateValue.deleteSheetEncapsulationSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialSheetEncapsulationStateValue.updateSheetEncapsulationSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t(
            "materials.sheetEncapsulation.admin.deleteSheetEncapsulationSize"
          )}
          subTitle={t(
            "materials.sheetEncapsulation.admin.subTitleDeleteSizeModal"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetEncapsulation.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetEncapsulation.admin.enterThickness"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.thickness
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetEncapsulation.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetEncapsulation.admin.enterWeight")}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.weight
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "weight",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterName")}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetEncapsulation.admin.quantityInPackage")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetEncapsulation.admin.enterQuantityInPackage"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.quantityInPackage
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "quantityInPackage",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetEncapsulation.admin.defaultPricePerUnit")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetEncapsulation.admin.enterDefaultPricePerUnit"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetEncapsulationStateValue?.updateState[item?.id]
                  ?.defaultPricePerUnit
              }
              onChange={(e: any) => {
                materialSheetEncapsulationStateValue?.onChangeUpdateStateSheetEncapsulationSize(
                  item?.id,
                  "defaultPricePerUnit",
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
export { SheetEncapsulationWeightsMapping };
