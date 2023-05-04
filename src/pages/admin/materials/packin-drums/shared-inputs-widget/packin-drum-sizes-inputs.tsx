import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/packin-drum";
import { useStyle } from "../add-new-packin-drum-modal/style";

const PlatSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["material"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["size"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["sizeName"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["drumRingNumber"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["defaultPricePerDrum"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
export { PlatSizeInputs };
