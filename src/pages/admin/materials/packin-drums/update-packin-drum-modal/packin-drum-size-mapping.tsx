import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPlatsState } from "../store/packin-drum";
import { useStyle } from "./style";

const PlatWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);
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
            materialPlatsStateValue.deletePlatSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialPlatsStateValue.updatePlatSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.plat.admin.deletePlatSize")}
          subTitle={t("materials.plat.admin.subTitleDeleteSizeModal")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.material")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.packinDrums.admin.enterMaterial")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.material}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "material",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.size")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.packinDrums.admin.enterSize")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.size}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "size",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.sizeName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.packinDrums.admin.enterSizeName")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.sizeName}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "sizeName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.drumRingNumber")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.packinDrums.admin.enterDrumRingNumber")}
              style={clasess.textInputStyle}
              value={
                materialPlatsStateValue?.updateState[item?.id]?.drumRingNumber
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "drumRingNumber",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.packinDrums.admin.enterWeight")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.weight}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "weight",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.packinDrums.admin.defaultPricePerDrum")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.packinDrums.admin.enterDefaultPricePerDrum"
              )}
              style={clasess.textInputStyle}
              value={
                materialPlatsStateValue?.updateState[item?.id]
                  ?.defaultPricePerDrum
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "defaultPricePerDrum",
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
export { PlatWeightsMapping };
