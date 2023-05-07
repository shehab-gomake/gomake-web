import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialVarnishState } from "../store/varnish";
import { useStyle } from "./style";

const DoubleSidedTapeRollMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);

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
            materialVarnishStateValue.deleteVarnish(item?.code)
          }
          onClickUpdate={() =>
            materialVarnishStateValue.updateVarnish(item?.code)
          }
          title={t("materials.magnets.admin.deleteVarnish")}
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
              value={materialVarnishStateValue?.updateState?.typeName}
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
              value={materialVarnishStateValue?.updateState?.volumeInLiters}
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
              value={materialVarnishStateValue?.updateState?.weightPerLiter}
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
              value={materialVarnishStateValue?.updateState?.literInSquareMeter}
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
                materialVarnishStateValue?.updateState?.defaultPricePerLiter
              }
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
                materialVarnishStateValue?.updateState?.defaultPricePerContainer
              }
              onChange={(e: any) => {
                materialVarnishStateValue?.onChangeUpdateStateVarnish(
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
