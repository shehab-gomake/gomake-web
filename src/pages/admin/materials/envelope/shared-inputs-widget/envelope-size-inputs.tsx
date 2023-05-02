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
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterCode")}
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
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterName")}
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
            {t("materials.plat.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterWidth")}
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
            {t("materials.plat.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterHeight")}
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
            {t("materials.envelops.admin.stock")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.envelops.admin.enterStock")}
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
            {t("materials.envelops.admin.quantityInPackage")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.envelops.admin.enterQuantityInPackage")}
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
            {t("materials.envelops.admin.isWithWindow")}
          </div>
          <GoMakeAutoComplate
            options={[true, false]}
            style={clasess.textInputStyle}
            // renderOption={(value: boolean) => value}
            placeholder={t("materials.envelops.admin.enterisWithWindow")}
            value={materialEnvelopesStateValue?.items[index]["isWithWindow"]}
            onChange={(e: any, value: any) => {
              materialEnvelopesStateValue?.changeItems(
                index,
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
