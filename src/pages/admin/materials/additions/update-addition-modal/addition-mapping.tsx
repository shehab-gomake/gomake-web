import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialAdditionsState } from "../store/additions";
import { useStyle } from "./style";

const AdditionMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );
  console.log("item", item);
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
            materialAdditionsStateValue.deleteAddition(item?.code)
          }
          onClickUpdate={() =>
            materialAdditionsStateValue.updateAddition(item?.code)
          }
          title={t("materials.additions.admin.deleteAddition")}
          subTitle={t("materials.additions.admin.deleteAdditionsSubTitle")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.additions.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.additions.admin.enterName")}
              style={clasess.textInputStyle}
              value={materialAdditionsStateValue?.updateState?.name}
              onChange={(e: any) => {
                materialAdditionsStateValue?.onChangeUpdateStateAddition(
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.additions.admin.adaptationField")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.additions.admin.enterAdaptationField")}
              style={clasess.textInputStyle}
              value={materialAdditionsStateValue?.updateState?.adaptationField}
              onChange={(e: any) => {
                materialAdditionsStateValue?.onChangeUpdateStateAddition(
                  "adaptationField",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.additions.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.additions.admin.enterDefaultPrice")}
              style={clasess.textInputStyle}
              value={materialAdditionsStateValue?.updateState?.defaultPrice}
              onChange={(e: any) => {
                materialAdditionsStateValue?.onChangeUpdateStateAddition(
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.additions.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.additions.admin.enterWeight")}
              style={clasess.textInputStyle}
              value={materialAdditionsStateValue?.updateState?.weight}
              onChange={(e: any) => {
                materialAdditionsStateValue?.onChangeUpdateStateAddition(
                  "weight",
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
export { AdditionMapping };
