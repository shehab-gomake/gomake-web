import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialEnvelopeState } from "../store/envelope";
import { useStyle } from "./style";

const EnvelopeWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
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
            materialEnvelopesStateValue.deleteEnvelopeSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialEnvelopesStateValue.updateEnvelopeSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.envelops.admin.deleteEnvelopeSize")}
          subTitle={t("materials.envelops.admin.subTitleDeleteModalSize")}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={materialEnvelopesStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
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
              value={materialEnvelopesStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
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
              value={materialEnvelopesStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
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
              value={materialEnvelopesStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterStock")}
              style={clasess.textInputStyle}
              value={materialEnvelopesStateValue?.updateState[item?.id]?.stock}
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
                  item?.id,
                  "stock",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.quantityInPackage")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterQuantityInPackage")}
              style={clasess.textInputStyle}
              value={
                materialEnvelopesStateValue?.updateState[item?.id]
                  ?.quantityInPackage
              }
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
                  item?.id,
                  "quantityInPackage",
                  e.target.value
                );
              }}
            />
          </div>
          <div style={{ width: 193.6 }}>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.isWithWindow")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterisWithWindow")}
              value={
                materialEnvelopesStateValue?.updateState[item?.id]?.isWithWindow
                  ? "Yes"
                  : "No"
              }
              onChange={(e: any, value: any) => {
                materialEnvelopesStateValue?.changeItems(
                  index,
                  "isWithWindowLabel",
                  value?.label
                );
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
                  item?.id,
                  "isWithWindow",
                  value?.value
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
                materialEnvelopesStateValue?.updateState[item?.id]?.defaultPrice
              }
              onChange={(e: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
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
export { EnvelopeWeightsMapping };
