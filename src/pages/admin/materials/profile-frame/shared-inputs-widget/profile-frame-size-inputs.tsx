import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialProfileFrameState } from "../store/profile-frame";
import { useStyle } from "../add-new-profile-frame-modal/style";

const ProfileFormSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
  );

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
            value={materialProfileFrameStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={materialProfileFrameStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={materialProfileFrameStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={materialProfileFrameStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={materialProfileFrameStateValue?.items[index]["length"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={materialProfileFrameStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
              materialProfileFrameStateValue?.items[index][
                "defaultPricePerMeter"
              ]
            }
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
            value={
              materialProfileFrameStateValue?.items[index][
                "defaultPricePerUnit"
              ]
            }
            onChange={(e: any) => {
              materialProfileFrameStateValue?.changeItems(
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
