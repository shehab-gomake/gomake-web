import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPackinDrumState } from "../store/packin-drum";
import { useStyle } from "../add-new-packin-drum-modal/style";

const PackinDrumSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinDrumStateValue = useRecoilValue<any>(
    materialPackinDrumState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "code",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.material")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinDrums.admin.enterMaterial")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["material"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "material",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.size")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinDrums.admin.enterSize")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["size"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "size",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.sizeName")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinDrums.admin.enterSizeName")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["sizeName"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "sizeName",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.drumRingNumber")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinDrums.admin.enterDrumRingNumber")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["drumRingNumber"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "drumRingNumber",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packinDrums.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={materialPackinDrumStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "weight",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packinDrums.admin.defaultPricePerDrum")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.packinDrums.admin.enterDefaultPricePerDrum"
            )}
            style={clasess.textInputStyle}
            value={
              materialPackinDrumStateValue?.items[index]["defaultPricePerDrum"]
            }
            onChange={(e: any) => {
              materialPackinDrumStateValue?.changeItems(
                index,
                "defaultPricePerDrum",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { PackinDrumSizeInputs };
