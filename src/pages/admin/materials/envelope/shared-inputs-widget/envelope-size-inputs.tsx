import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialEnvelopeState } from "../store/envelope";
import { useStyle } from "../add-new-envelope-modal/style";

const EnvelopeSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialEnvelopesStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "code",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
            style={clasess.textInputStyle}
            value={materialEnvelopesStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.width")} (cm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
            style={clasess.textInputStyle}
            value={materialEnvelopesStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "width",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.height")} (cm)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterHeight")}
            style={clasess.textInputStyle}
            value={materialEnvelopesStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.stock")} (units)
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterStock")}
            style={clasess.textInputStyle}
            value={materialEnvelopesStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
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
              materialEnvelopesStateValue?.items[index]["quantityInPackage"]
            }
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
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
            // renderOption={(value: boolean) => value}
            placeholder={t("materials.inputs.enterisWithWindow")}
            value={
              materialEnvelopesStateValue?.items[index]["isWithWindowLabel"]
            }
            onChange={(e: any, value: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "isWithWindowLabel",
                value?.label
              );
              materialEnvelopesStateValue?.changeItems(
                index,
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
            value={materialEnvelopesStateValue?.items[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
                "defaultPrice",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { EnvelopeSizeInputs };
