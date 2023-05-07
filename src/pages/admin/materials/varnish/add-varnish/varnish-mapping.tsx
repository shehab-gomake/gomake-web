import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { materialMagnetState } from "../store/varnish";
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
              {t("materials.varnishs.admin.typeName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterTypeName")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["typeName"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "typeName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterVolumeInLiters")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["volumeInLiters"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "volumeInLiters",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.weightPerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.varnishs.admin.enterWeightPerLiter")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["weightPerLiter"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "weightPerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.literInSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterLiterInSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.items[index]["literInSquareMeter"]
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "literInSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.defaultPricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterDefaultPricePerLiter"
              )}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.items[index]["defaultPricePerLiter"]
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "defaultPricePerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.varnishs.admin.defaultPricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.varnishs.admin.enterDefaultPricePerContainer"
              )}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.items[index][
                  "defaultPricePerContainer"
                ]
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "defaultPricePerContainer",
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
