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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.canvasFrames.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.canvasFrames.admin.enterCode")}
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
              {t("materials.canvasFrames.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.canvasFrames.admin.enterDefaultPrice")}
              style={clasess.textInputStyle}
              value={
                materialCanvasFramesStateValue?.items[index]["defaultPrice"]
              }
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
              {t("materials.canvasFrames.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.canvasFrames.admin.enterHeight")}
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
            <div style={clasess.lableTextStyle}>
              {t("materials.canvasFrames.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.canvasFrames.admin.entername")}
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
          <div style={clasess.mainWaightsContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.canvasFrames.admin.stock")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.canvasFrames.admin.enterStock")}
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
                {t("materials.canvasFrames.admin.thickness")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.canvasFrames.admin.enterThickness")}
                style={clasess.textInputStyle}
                value={
                  materialCanvasFramesStateValue?.items[index]["thickness"]
                }
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
                {t("materials.canvasFrames.admin.weight")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.canvasFrames.admin.enterWeight")}
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
                {t("materials.canvasFrames.admin.width")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.canvasFrames.admin.enterWidth")}
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
        </div>
      </div>
    </>
  );
};
export { CanvasFrameSizeInputs };
