import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { materialMagnetState } from "../store/magnets";
import { useStyle } from "./style";

const MagnetMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);

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
              value={materialMagnetStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "name",
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
              value={materialMagnetStateValue?.items[index]["weight"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "weight",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.withGlue")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterWithGlue")}
              value={materialMagnetStateValue?.items[index]["withGlue"]}
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "withGlue",
                  value?.label
                );
                materialMagnetStateValue?.changeItems(
                  index,
                  "withGlue",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.directPrinting")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterDirectPrinting")}
              value={materialMagnetStateValue?.items[index]["directPrinting"]}
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "directPrinting",
                  value?.label
                );
                materialMagnetStateValue?.changeItems(
                  index,
                  "directPrinting",
                  value?.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.linkage")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.inputs.enterLinkage")}
              value={materialMagnetStateValue?.items[index]["linkage"]}
              onChange={(e: any, value: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "linkage",
                  value?.label
                );
                materialMagnetStateValue?.changeItems(
                  index,
                  "linkage",
                  value?.value
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
              value={materialMagnetStateValue?.items[index]["width"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
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
              value={materialMagnetStateValue?.items[index]["height"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "height",
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
              value={materialMagnetStateValue?.items[index]["defaultPrice"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.thickness")} (mm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterThickness")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["thickness"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "thickness",
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
export { MagnetMapping };
