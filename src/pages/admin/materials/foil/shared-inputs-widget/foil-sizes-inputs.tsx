import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialFoilState } from "../store/foil";
import { useStyle } from "../add-new-foil-modal/style";

const FoilSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);

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
            value={materialFoilStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
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
            value={materialFoilStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.frames.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.frames.admin.enterThickness")}
            style={clasess.textInputStyle}
            value={materialFoilStateValue?.items[index]["thickness"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "thickness",
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
            value={materialFoilStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
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
            value={materialFoilStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.foils.admin.weightPerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.foils.admin.enterWeightPerSquareMeter")}
            style={clasess.textInputStyle}
            value={materialFoilStateValue?.items[index]["weightPerSquareMeter"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "weightPerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.foils.admin.defaultPricePerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.foils.admin.enterDefaultPricePerSquareMeter"
            )}
            style={clasess.textInputStyle}
            value={
              materialFoilStateValue?.items[index]["defaultPricePerSquareMeter"]
            }
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "defaultPricePerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.foils.admin.defaultPricePerRoll")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.foils.admin.enterDefaultPricePerRoll")}
            style={clasess.textInputStyle}
            value={materialFoilStateValue?.items[index]["defaultPricePerRoll"]}
            onChange={(e: any) => {
              materialFoilStateValue?.changeItems(
                index,
                "defaultPricePerRoll",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { FoilSizeInputs };
