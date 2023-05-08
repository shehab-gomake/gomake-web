import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialFoilState } from "../store/foil";
import { useStyle } from "./style";

const FoilWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);
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
            materialFoilStateValue.deleteFoilSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialFoilStateValue.updateFoilSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.foils.admin.deleteFoilSize")}
          subTitle={t("materials.foils.admin.subTitleDeleteSizeModal")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={materialFoilStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
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
              value={materialFoilStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "name",
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
              value={materialFoilStateValue?.updateState[item?.id]?.thickness}
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "thickness",
                  e.target.value
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
              value={materialFoilStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
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
              value={materialFoilStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.foils.admin.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.foils.admin.enterWeightPerSquareMeter")}
              style={clasess.textInputStyle}
              value={
                materialFoilStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.foils.admin.defaultPricePerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.foils.admin.enterDefaultPricePerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialFoilStateValue?.updateState[item?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "defaultPricePerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.foils.admin.defaultPricePerRoll")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.foils.admin.enterDefaultPricePerRoll")}
              style={clasess.textInputStyle}
              value={
                materialFoilStateValue?.updateState[item?.id]
                  ?.defaultPricePerRoll
              }
              onChange={(e: any) => {
                materialFoilStateValue?.onChangeUpdateStateFoilSize(
                  item?.id,
                  "defaultPricePerRoll",
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
export { FoilWeightsMapping };
