import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";
import { materialVarnishState } from "../store/varnish";
import { useStyle } from "./style";

const VarnishMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.code")}
              style={clasess.textInputStyle}
              value={materialVarnishStateValue?.items[index]["code"]}
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.typeName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterTypeName")}
              style={clasess.textInputStyle}
              value={materialVarnishStateValue?.items[index]["typeName"]}
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "typeName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterVolumeInLiters")}
              style={clasess.textInputStyle}
              value={materialVarnishStateValue?.items[index]["volumeInLiters"]}
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "volumeInLiters",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weightPerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeightPerLiter")}
              style={clasess.textInputStyle}
              value={materialVarnishStateValue?.items[index]["weightOfLiter"]}
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "weightOfLiter",
                  e.target.value
                );
              }}
              type="number"
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.literInSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterLiterInSquareMeter")}
              style={clasess.textInputStyle}
              value={
                materialVarnishStateValue?.items[index]["literInSquareMeter"]
              }
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "literInSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.defaultPricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerLiter")}
              style={clasess.textInputStyle}
              value={
                materialVarnishStateValue?.items[index]["defaultPricePerLiter"]
              }
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "defaultPricePerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.defaultPricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerContainer")}
              style={clasess.textInputStyle}
              value={
                materialVarnishStateValue?.items[index][
                  "defaultPricePerContainer"
                ]
              }
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "defaultPricePerContainer",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.inkConsumption")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.inkConsumption")}
              style={clasess.textInputStyle}
              value={materialVarnishStateValue?.items[index]["inkConsumption"]}
              onChange={(e: any) => {
                materialVarnishStateValue?.changeItems(
                  index,
                  "inkConsumption",
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
export { VarnishMapping };
