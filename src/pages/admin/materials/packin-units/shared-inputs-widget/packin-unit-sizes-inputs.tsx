import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPackinUnitsState } from "../store/packin-units";
import { useStyle } from "../add-new-packin-unit-modal/style";

const PackinUnitSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinUnits.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinUnits.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialPackinUnitsStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
            value={materialPackinUnitsStateValue?.items[index]["material"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
            value={materialPackinUnitsStateValue?.items[index]["size"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
            value={materialPackinUnitsStateValue?.items[index]["sizeName"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
            placeholder={t("materials.packinUnits.admin.enterWidth")}
            style={clasess.textInputStyle}
            value={materialPackinUnitsStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
            value={materialPackinUnitsStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
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
              materialPackinUnitsStateValue?.items[index]["defaultPricePerUnit"]
            }
            onChange={(e: any) => {
              materialPackinUnitsStateValue?.changeItems(
                index,
                "defaultPricePerUnit",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { PackinUnitSizeInputs };
