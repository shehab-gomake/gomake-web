import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "../add-new-profile-frame-modal/style";

const ProfileFormSizeInputs = ({ index }) => {
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
            {t("materials.plat.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterName")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "name",
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
            value={materialPlatsStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
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
            value={materialPlatsStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.profileFrames.admin.lenght")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.profileFrames.admin.enterLenght")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["length"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "length",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.profileFrames.admin.stock")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.profileFrames.admin.enterStock")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "stock",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.profileFrames.admin.defaultPricePerMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.profileFrames.admin.enterDefaultPricePerMeter"
            )}
            style={clasess.textInputStyle}
            value={
              materialPlatsStateValue?.items[index]["defaultPricePerMeter"]
            }
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "defaultPricePerMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.profileFrames.admin.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.profileFrames.admin.enterDefaultPricePerUnit"
            )}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["defaultPricePerUnit"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
export { ProfileFormSizeInputs };
