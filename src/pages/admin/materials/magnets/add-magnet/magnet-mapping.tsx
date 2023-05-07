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
              {t("materials.magnets.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.magnets.admin.enterName")}
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
              {t("materials.magnets.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.magnets.admin.enterWeight")}
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
              {t("materials.magnets.admin.withGlue")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.magnets.admin.enterWithGlue")}
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
              {t("materials.magnets.admin.directPrinting")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.magnets.admin.enterDirectPrinting")}
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
              {t("materials.magnets.admin.linkage")}
            </div>
            <GoMakeAutoComplate
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              style={clasess.textInputStyle}
              placeholder={t("materials.magnets.admin.enterLinkage")}
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
              {t("materials.magnets.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.magnets.admin.enterWidth")}
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
              {t("materials.magnets.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.magnets.admin.enterHeight")}
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
              {t("materials.magnets.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.magnets.admin.enterDefaultPrice")}
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
        </div>
      </div>
    </>
  );
};
export { MagnetMapping };
