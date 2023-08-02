import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPackingsState } from "../store/packings";
import { useStyle } from "../add-new-packing-modal/style";

const PackingVolumnInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);

  return (
    <div style={clasess.mainWaightsContainer}>
      <div>
        <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
        <GomakeTextInput
          placeholder={t("materials.inputs.enterCode")}
          style={clasess.textInputStyle}
          value={materialPackingsStateValue?.items[index]["code"]}
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
              index,
              "code",
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
          value={materialPackingsStateValue?.items[index]["width"]}
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
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
          value={materialPackingsStateValue?.items[index]["height"]}
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
              index,
              "height",
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
          value={materialPackingsStateValue?.items[index]["length"]}
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
              index,
              "length",
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
          value={materialPackingsStateValue?.items[index]["weight"]}
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
              index,
              "weight",
              e.target.value
            );
          }}
        />
      </div>
      <div>
        <div style={clasess.lableTextStyle}>
          {t("materials.inputs.defaultPricePerUnit")}
        </div>
        <GomakeTextInput
          placeholder={t("materials.inputs.enterDefaultPricePerUnit")}
          style={clasess.textInputStyle}
          value={
            materialPackingsStateValue?.items[index][
              "weidefaultPricePerUnitght"
            ]
          }
          onChange={(e: any) => {
            materialPackingsStateValue?.changeItems(
              index,
              "defaultPricePerUnit",
              e.target.value
            );
          }}
        />
      </div>
    </div>
  );
};
export { PackingVolumnInputs };
