import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialTubeState } from "../store/tube";
import { useStyle } from "../add-new-tube-modal/style";

const TubeSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);

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
            value={materialTubeStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
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
            value={materialTubeStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.tubes.admin.lenght")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.tubes.admin.enterLenght")}
            style={clasess.textInputStyle}
            value={materialTubeStateValue?.items[index]["lenght"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
                index,
                "lenght",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.tubes.admin.diameter")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.tubes.admin.enterDiameter")}
            style={clasess.textInputStyle}
            value={materialTubeStateValue?.items[index]["diameter"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
                index,
                "diameter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.tubes.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.tubes.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={materialTubeStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
                index,
                "weight",
                e.target.value
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
            value={materialTubeStateValue?.items[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialTubeStateValue?.changeItems(
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
export { TubeSizeInputs };
