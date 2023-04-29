import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const SheetWeightsMapping = ({ index, item, selectedItem }) => {
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
          title={"Delete Sheet Weight"}
          subTitle={"Are you sure you want to delete sheet weight?"}
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
              {t("materials.plat.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterName")}
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
              {t("materials.tubes.admin.lenght")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterLenght")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.lenght}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "lenght",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.tubes.admin.diameter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterDiameter")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.updateState[item?.id]?.diameter}
              onChange={(e: any) => {
                materialPlatsStateValue?.onChangeUpdateStatePlatSize(
                  item?.id,
                  "diameter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.tubes.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterWeight")}
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
              {t("materials.plat.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterDefaultPrice")}
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
export { SheetWeightsMapping };
