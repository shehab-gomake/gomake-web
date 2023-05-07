import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPackinUnitsState } from "../store/packin-units";
import { useStyle } from "./style";

const PackinUnitSizeMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
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
            materialPackinUnitsStateValue.deletePackinUnitSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialPackinUnitsStateValue.updatePackinUnitSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.packinUnits.admin.deletePackinUnitSize")}
          subTitle={t("materials.packinUnits.admin.subTitleDeleteSizeModal")}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={clasess.mainWaightsContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.code")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterCode")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.code
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "code",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.material")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterMaterial")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.material
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "material",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.size")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterSize")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.size
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "size",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.sizeName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterSizeName")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.sizeName
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "sizeName",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.width")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterwidth")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.width
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "width",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.weight")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packinUnits.admin.enterWeight")}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]?.weight
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "weight",
                    e.target.value
                  );
                }}
              />
            </div>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packinUnits.admin.defaultPricePerUnit")}
              </div>
              <GomakeTextInput
                placeholder={t(
                  "materials.packinUnits.admin.enterDefaultPricePerUnit"
                )}
                style={clasess.textInputStyle}
                value={
                  materialPackinUnitsStateValue?.updateState[item?.id]
                    ?.defaultPricePerUnit
                }
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.onChangeUpdateStatePackinUnitSize(
                    item?.id,
                    "defaultPricePerUnit",
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export { PackinUnitSizeMapping };
