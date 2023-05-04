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
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
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
              {t("materials.plat.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterName")}
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
              {t("materials.frames.admin.color")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.frames.admin.enterColor")}
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
              {t("materials.plat.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterWidth")}
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
              {t("materials.plat.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterHeight")}
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
              {t("materials.frames.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.frames.admin.enterThickness")}
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
              {t("materials.frames.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.frames.admin.enterWeight")}
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
              {t("materials.frames.admin.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.frames.admin.enterStock")}
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
              {t("materials.plat.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterDefaultPrice")}
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
