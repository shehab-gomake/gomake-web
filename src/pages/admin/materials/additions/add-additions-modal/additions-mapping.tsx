import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";
import { materialAdditionsState } from "../store/additions";
import { useStyle } from "./style";

const AdditionMapping = ({ index }) => {
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
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={materialAdditionsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialAdditionsStateValue?.changeItems(
                  index,
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
              value={
                materialAdditionsStateValue?.items[index]["adaptationField"]
              }
              onChange={(e: any) => {
                materialAdditionsStateValue?.changeItems(
                  index,
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
              value={materialAdditionsStateValue?.items[index]["defaultPrice"]}
              onChange={(e: any) => {
                materialAdditionsStateValue?.changeItems(
                  index,
                  "defaultPrice",
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
              value={materialAdditionsStateValue?.items[index]["weight"]}
              onChange={(e: any) => {
                materialAdditionsStateValue?.changeItems(
                  index,
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
