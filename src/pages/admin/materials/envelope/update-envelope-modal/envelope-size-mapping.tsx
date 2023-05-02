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
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
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
              {t("materials.plat.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterName")}
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
              {t("materials.plat.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterWidth")}
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
              {t("materials.plat.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterHeight")}
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
              {t("materials.envelops.admin.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterStock")}
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
              {t("materials.envelops.admin.quantityInPackage")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterQuantityInPackage")}
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
              {t("materials.envelops.admin.isWithWindow")}
            </div>
            <GoMakeAutoComplate
              options={[true, false]}
              style={clasess.textInputStyle}
              placeholder={t("materials.envelops.admin.enterisWithWindow")}
              value={
                materialEnvelopesStateValue?.updateState[item?.id]?.isWithWindow
              }
              onChange={(e: any, value: any) => {
                materialEnvelopesStateValue?.onChangeUpdateStateEnvelopeSize(
                  item?.id,
                  "isWithWindow",
                  value
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
