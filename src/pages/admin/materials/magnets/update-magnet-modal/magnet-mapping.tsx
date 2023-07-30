import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialMagnetState } from "../store/magnets";
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
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.name}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeight")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.weight}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "weight",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.withGlue")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterWithGlue")}
              value={
                materialMagnetStateValue?.updateState.withGlue ? "Yes" : "No"
              }
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems("withGlue", value?.label);
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "withGlue",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.directPrinting")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterDirectPrinting")}
              value={
                materialMagnetStateValue?.updateState?.directPrinting
                  ? "Yes"
                  : "No"
              }
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems(
                  "directPrinting",
                  value?.label
                );
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "directPrinting",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.linkage")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterLinkage")}
              value={
                materialMagnetStateValue?.updateState?.linkage ? "Yes" : "No"
              }
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems(
                  "linkageLable",
                  value?.label
                );
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "linkage",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWidth")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.width}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHeight")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.height}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "height",
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
              value={materialMagnetStateValue?.updateState?.defaultPrice}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "defaultPrice",
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
              value={materialMagnetStateValue?.updateState?.thickness}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "thickness",
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
