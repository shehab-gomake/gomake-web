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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
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
            {t("materials.inputs.material")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterMaterial")}
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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.size")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterSize")}
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
            {t("materials.inputs.sizeName")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterSizeName")}
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
            {t("materials.inputs.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
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
            {t("materials.inputs.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWeight")}
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
            {t("materials.inputs.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerUnit")}
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
