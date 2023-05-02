import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialProfileFrameState } from "../store/profile-frame";
import { useStyle } from "./style";

const ProfileFrameWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
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
            materialProfileFrameStateValue.deleteProfileFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialProfileFrameStateValue.updateProfileFrameSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.profileFrames.admin.deleteProfileFrameSizeTitle")}
          subTitle={t(
            "materials.profileFrames.admin.deleteLProfileFrameSizeSubTitle"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.code
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
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
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.name
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
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
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.width
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
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
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.height
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
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
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.length
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
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
              value={
                materialProfileFrameStateValue?.updateState[item?.id]?.stock
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
                  "stock",
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
                materialProfileFrameStateValue?.updateState[item?.id]
                  ?.defaultPricePerMeter
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
                  "defaultPricePerMeter",
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
                materialProfileFrameStateValue?.updateState[item?.id]
                  ?.defaultPricePerUnit
              }
              onChange={(e: any) => {
                materialProfileFrameStateValue?.onChangeUpdateStateProfileFrameSize(
                  item?.id,
                  "defaultPricePerUnit",
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
export { ProfileFrameWeightsMapping };
