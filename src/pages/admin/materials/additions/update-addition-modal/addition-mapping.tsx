import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialAdditionsState } from "../store/additions";
import { useStyle } from "./style";

const AdditionMapping = ({ index, item }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );
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
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
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
              {t("materials.inputs.adaptationField")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterAdaptationField")}
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
              {t("materials.inputs.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPrice")}
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
              {t("materials.inputs.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeight")}
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
