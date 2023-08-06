import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialCanvasFramesState } from "../store/canvas-frames";
import { useStyle } from "./style";

const CanvasFrameWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );
  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <ControlIconsWidget
          t={t}
          item={item}
          onClickDelete={() =>
            materialCanvasFramesStateValue.deleteFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialCanvasFramesStateValue.updateFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.canvasFrames.admin.deleteCanvasFrame")}
          subTitle={t("materials.canvasFrames.admin.subTitleDeleteSizeModal")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.code
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
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
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]
                  ?.defaultPrice
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>

          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.entername")}
              style={clasess.textInputStyle}
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.name
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "name",
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
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.stock
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "stock",
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
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.thickness
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
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
              placeholder={t("materials.inputs.weight")}
              style={clasess.textInputStyle}
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.weight
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "weight",
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
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.width
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
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
              value={
                materialCanvasFramesStateValue?.updateState[item?.id]?.height
              }
              onChange={(e: any) => {
                materialCanvasFramesStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { CanvasFrameWeightsMapping };
