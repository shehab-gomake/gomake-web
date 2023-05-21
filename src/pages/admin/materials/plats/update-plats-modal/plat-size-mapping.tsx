import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPlatsState } from "../store/plat";
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
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
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
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "name",
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
              value={materialPlatsStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
              value={materialPlatsStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
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
              value={
                materialPlatsStateValue?.updateState[item?.id]?.defaultPrice
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
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
export { PlatWeightsMapping };
