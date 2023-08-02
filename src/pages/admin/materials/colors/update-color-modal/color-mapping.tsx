import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialColorState } from "../store/colors";
import { useStyle } from "./style";

const ColorMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialColorState);

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
              {t("materials.colors.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.code")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.code}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.colorName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.colorName")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.colorName}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "colorName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.volumeInLiters")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.width}
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
              {t("materials.colors.literPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.literPerSquareMeter")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.literPerSquareMeter}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "literPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.pricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.pricePerLiter")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.pricePerLiter}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "pricePerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.pricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.pricePerContainer")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.pricePerContainer}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "pricePerContainer",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.inkConsumption")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.inkConsumption")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.inkConsumption}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "inkConsumption",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.conditions")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.conditions")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.updateState?.conditions}
              onChange={(e: any) => {
                materialMagnetStateValue?.onChangeUpdateStateMagnet(
                  "conditions",
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
export { ColorMapping };
