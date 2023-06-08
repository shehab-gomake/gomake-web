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
              {t("materials.inputs.typeName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterTypeName")}
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
              {t("materials.inputs.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterVolumeInLiters")}
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
              {t("materials.inputs.weightPerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeightPerLiter")}
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
              {t("materials.inputs.literInSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterLiterInSquareMeter")}
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
              {t("materials.inputs.defaultPricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerLiter")}
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
              {t("materials.inputs.defaultPricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerContainer")}
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
