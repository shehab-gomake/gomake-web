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
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterCode")}
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
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterName")}
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
            {t("materials.frames.admin.color")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.frames.admin.enterColor")}
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
            {t("materials.plat.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterWidth")}
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
            {t("materials.plat.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterHeight")}
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
            {t("materials.frames.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.frames.admin.enterthickness")}
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
            {t("materials.frames.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.frames.admin.enterWeight")}
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
            {t("materials.frames.admin.stock")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.frames.admin.enterStock")}
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
            {t("materials.plat.admin.defaultPrice")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterDefaultPrice")}
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
