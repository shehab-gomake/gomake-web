import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialTubeState } from "../store/tube";
import { useStyle } from "./style";

const TubeWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);
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
            materialTubeStateValue.deleteTubeSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialTubeStateValue.updateTubeSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.tubes.admin.deleteTubeSize")}
          subTitle={t("materials.tubes.admin.subTitleDeleteModalSize")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={materialTubeStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
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
              value={materialTubeStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.length")} (cm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterLength")}
              style={clasess.textInputStyle}
              value={materialTubeStateValue?.updateState[item?.id]?.lenght}
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
                  item?.id,
                  "lenght",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.diameter")} (cm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDiameter")}
              style={clasess.textInputStyle}
              value={materialTubeStateValue?.updateState[item?.id]?.diameter}
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
                  item?.id,
                  "diameter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weight")} (gm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeight")}
              style={clasess.textInputStyle}
              value={materialTubeStateValue?.updateState[item?.id]?.weight}
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
                  item?.id,
                  "weight",
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
              value={
                materialTubeStateValue?.updateState[item?.id]?.defaultPrice
              }
              onChange={(e: any) => {
                materialTubeStateValue?.onChangeUpdateStateTubeSize(
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
export { TubeWeightsMapping };
