import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialCanvasFramesState } from "../store/canvas-frames";
import { useStyle } from "../add-new-canvas-frames-modal/style";

const CanvasFrameSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialCanvasFramesStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "code",
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
            value={materialCanvasFramesStateValue?.items[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "defaultPrice",
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
            value={materialCanvasFramesStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.entername")}
            style={clasess.textInputStyle}
            value={materialCanvasFramesStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "name",
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
            value={materialCanvasFramesStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "stock",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterThickness")}
            style={clasess.textInputStyle}
            value={materialCanvasFramesStateValue?.items[index]["thickness"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "thickness",
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
            value={materialCanvasFramesStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "weight",
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
            value={materialCanvasFramesStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialCanvasFramesStateValue?.changeItems(
                index,
                "width",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { CanvasFrameSizeInputs };
