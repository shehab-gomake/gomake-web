import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialMagnetState } from "../store/varnish";
import { useStyle } from "./style";

const DoubleSidedTapeRollMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);

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
            materialMagnetStateValue.deleteMagnet(item?.code)
          }
          onClickUpdate={() =>
            materialMagnetStateValue.updateMagnet(item?.code)
          }
          title={t("materials.magnets.admin.deleteMagnet")}
          subTitle={t("materials.magnets.admin.subTitleDeleteModal")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.typeName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterTypeName")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.typeName}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "typeName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterVolumeInLiters")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.volumeInLiters}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "volumeInLiters",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.weightPerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterWeightPerLiter")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.weightPerLiter}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "weightPerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.literInSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterLiterInSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.literInSquareMeter}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "literInSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.defaultPricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterDefaultPricePerLiter"
              )}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.updateState?.defaultPricePerLiter
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "defaultPricePerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.defaultPricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterDefaultPricePerContainer"
              )}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.updateState?.defaultPricePerContainer
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "defaultPricePerContainer",
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
export { DoubleSidedTapeRollMapping };
