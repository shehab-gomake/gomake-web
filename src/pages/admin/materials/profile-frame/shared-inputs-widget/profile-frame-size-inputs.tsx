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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
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
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
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
            {t("materials.inputs.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
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
            {t("materials.inputs.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterHeight")}
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
            {t("materials.inputs.length")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterLength")}
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
            {t("materials.inputs.stock")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterStock")}
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
            {t("materials.inputs.defaultPricePerMeter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerMeter")}
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
            {t("materials.inputs.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerUnit")}
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
