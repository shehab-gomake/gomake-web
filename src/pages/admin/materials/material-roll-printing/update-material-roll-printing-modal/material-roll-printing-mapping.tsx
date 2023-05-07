import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useStyle } from "./style";

const MaterialRollPrintingWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
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
            materialMaterialRollPrintingStateValue.deleteMaterialRollPrintingSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialMaterialRollPrintingStateValue.updateMaterialRollPrintingSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t(
            "materials.printingMaterials.admin.deleteMaterialRollPrintingSize"
          )}
          subTitle={t(
            "materials.printingMaterials.admin.subTitleDeleteSizeModal"
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
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "code",
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
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.envelops.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.envelops.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.printingMaterials.admin.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.printingMaterials.admin.enterWeightPerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div style={{ width: 193.6 }}>
            <div style={clasess.lableTextStyle}>
              {t("materials.printingMaterials.admin.withPremier")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t(
                "materials.printingMaterials.admin.selectWithPremier"
              )}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.withPremier
                  ? "Yes"
                  : "No"
              }
              onChange={(e: any, value: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "withPremierLabel",
                  value?.label
                );
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "withPremier",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.printingMaterials.admin.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.printingMaterials.admin.enterStock")}
              style={clasess.textInputStyle}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.stock
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "stock",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t(
                "materials.printingMaterials.admin.defaultPricePerSquareMeter"
              )}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.printingMaterials.admin.enterDefaultPricePerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialMaterialRollPrintingStateValue?.updateState[item?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialMaterialRollPrintingStateValue?.onChangeUpdateStateMaterialRollPrintingSize(
                  item?.id,
                  "defaultPricePerSquareMeter",
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
export { MaterialRollPrintingWeightsMapping };
