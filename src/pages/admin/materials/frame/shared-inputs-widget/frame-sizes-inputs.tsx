import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialFrameState } from "../store/frame";
import { useStyle } from "../add-new-frame-modal/style";

const FrameSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
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
            value={materialFrameStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.color")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterColor")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["color"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "color",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.width")} (cm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "width",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.height")} (cm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterHeight")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.thickness")} (mm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterthickness")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["thickness"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "thickness",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.weight")} (gm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWeight")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "weight",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.stock")} (units)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterStock")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "stock",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPrice")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPrice")}
            style={clasess.textInputStyle}
            value={materialFrameStateValue?.items[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialFrameStateValue?.changeItems(
                index,
                "defaultPrice",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { FrameSizeInputs };
