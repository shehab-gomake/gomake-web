import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";
import { materialColorState } from "../store/colors";
import { useStyle } from "./style";

const ColorMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialColorState);

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.code")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["code"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.colorName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.colorName")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["colorName"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "colorName",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.volumeInLiters")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.volumeInLiters")}
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
              {t("materials.colors.literPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.literPerSquareMeter")}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.items[index]["literPerSquareMeter"]
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "literPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.pricePerLiter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.pricePerLiter")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["pricePerLiter"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "pricePerLiter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.pricePerContainer")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.pricePerContainer")}
              style={clasess.textInputStyle}
              value={
                materialMagnetStateValue?.items[index]["pricePerContainer"]
              }
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "pricePerContainer",
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
              value={materialMagnetStateValue?.items[index]["inkConsumption"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "inkConsumption",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.colors.conditions")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.colors.conditions")}
              style={clasess.textInputStyle}
              value={materialMagnetStateValue?.items[index]["conditions"]}
              onChange={(e: any) => {
                materialMagnetStateValue?.changeItems(
                  index,
                  "conditions",
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
export { ColorMapping };
