import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useStyle } from "../add-new-material-roll-printing-modal/style";

const RollPrintingSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialMaterialRollPrintingStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
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
            value={materialMaterialRollPrintingStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
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
            value={
              materialMaterialRollPrintingStateValue?.items[index]["width"]
            }
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
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
            value={
              materialMaterialRollPrintingStateValue?.items[index]["height"]
            }
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.weightPerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWeightPerSquareMeter")}
            style={clasess.textInputStyle}
            value={
              materialMaterialRollPrintingStateValue?.items[index][
                "weightPerSquareMeter"
              ]
            }
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "weightPerSquareMeter",
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
            placeholder={t("materials.inputs.selectWithPremier")}
            value={
              materialMaterialRollPrintingStateValue?.items[index][
                "withPremierLabel"
              ]
            }
            onChange={(e: any, value: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "withPremierLabel",
                value?.label
              );
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "withPremier",
                value?.value
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
            value={
              materialMaterialRollPrintingStateValue?.items[index]["stock"]
            }
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "stock",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPricePerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerSquareMeter")}
            style={clasess.textInputStyle}
            value={
              materialMaterialRollPrintingStateValue?.items[index][
                "defaultPricePerSquareMeter"
              ]
            }
            onChange={(e: any) => {
              materialMaterialRollPrintingStateValue?.changeItems(
                index,
                "defaultPricePerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { RollPrintingSizeInputs };
