import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPackingsState } from "../store/packings";
import { useStyle } from "./style";

const PackingVolumeMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);
  return (
    <div
      key={index}
      style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
    >
      <ControlIconsWidget
        t={t}
        item={item}
        onClickDelete={() =>
          materialPackingsStateValue.deletePackingVolume(
            item?.id,
            selectedItem?.categoryName
          )
        }
        onClickUpdate={() =>
          materialPackingsStateValue.updatePackingVolume(
            item?.id,
            selectedItem?.categoryName
          )
        }
        title={t("materials.packings.admin.deletePackingVolume")}
        subTitle={t("materials.packings.admin.subTitleDeleteVolumeModal")}
      />
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialPackingsStateValue?.updateState[item?.id]?.code}
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "code",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterWidth")}
            style={clasess.textInputStyle}
            value={materialPackingsStateValue?.updateState[item?.id]?.width}
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "width",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterHeight")}
            style={clasess.textInputStyle}
            value={materialPackingsStateValue?.updateState[item?.id]?.height}
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.length")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterLength")}
            style={clasess.textInputStyle}
            value={materialPackingsStateValue?.updateState[item?.id]?.length}
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "length",
                e.target.value
              );
            }}
          />
        </div>

        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={materialPackingsStateValue?.updateState[item?.id]?.weight}
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "weight",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.packings.admin.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.packings.admin.enterDefaultPricePerUnit")}
            style={clasess.textInputStyle}
            value={
              materialPackingsStateValue?.updateState[item?.id]
                ?.defaultPricePerUnit
            }
            onChange={(e: any) => {
              materialPackingsStateValue?.onChangeUpdateStatePackingVolume(
                item?.id,
                "defaultPricePerUnit",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
export { PackingVolumeMapping };
