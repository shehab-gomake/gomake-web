import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialFrameState } from "../store/frame";
import { useStyle } from "./style";

const FrameWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);
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
            materialFrameStateValue.deleteFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialFrameStateValue.updateFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.frames.admin.deleteFrameSize")}
          subTitle={t("materials.frames.admin.subTitleDeleteSizeModal")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={materialFrameStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
                  "code",
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
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={materialFrameStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
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
              value={materialFrameStateValue?.updateState[item?.id]?.color}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
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
              value={materialFrameStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
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
              value={materialFrameStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
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
              placeholder={t("materials.inputs.enterThickness")}
              style={clasess.textInputStyle}
              value={materialFrameStateValue?.updateState[item?.id]?.thickness}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
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
              placeholder={t("materials.inputs.enterWeight")}
              style={clasess.textInputStyle}
              value={materialFrameStateValue?.updateState[item?.id]?.weight}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
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
              value={materialFrameStateValue?.updateState[item?.id]?.stock}
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
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
              value={
                materialFrameStateValue?.updateState[item?.id]?.defaultPrice
              }
              onChange={(e: any) => {
                materialFrameStateValue?.onChangeUpdateStateFrameSize(
                  item?.id,
                  "defaultPrice",
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
export { FrameWeightsMapping };
