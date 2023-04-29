import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const SheetWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);
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
            materialPlatsStateValue.deletePlatSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialPlatsStateValue.updatePlatSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={"Delete Sheet Weight"}
          subTitle={"Are you sure you want to delete sheet weight?"}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
              value={materialPlatsStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
              value={materialPlatsStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
              value={materialPlatsStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
                materialPlatsStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
              options={[true, false]}
              style={clasess.textInputStyle}
              placeholder={t(
                "materials.printingMaterials.admin.selectWithPremier"
              )}
              value={
                materialPlatsStateValue?.updateState[item?.id]?.withPremier
              }
              onChange={(e: any, value: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "withPremier",
                  value
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
              value={materialPlatsStateValue?.updateState[item?.id]?.stock}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
                materialPlatsStateValue?.updateState[item?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
export { SheetWeightsMapping };
