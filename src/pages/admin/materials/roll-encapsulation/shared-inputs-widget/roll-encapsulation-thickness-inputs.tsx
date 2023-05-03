import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";

const RollEncapsulationWeightsInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

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
            value={materialRollEncapsulationStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialRollEncapsulationStateValue?.changeItems(
                index,
                "code",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterName")}
            style={clasess.textInputStyle}
            value={materialRollEncapsulationStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialRollEncapsulationStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterThickness")}
            style={clasess.textInputStyle}
            value={
              materialRollEncapsulationStateValue?.items[index]["thickness"]
            }
            onChange={(e: any) => {
              materialRollEncapsulationStateValue?.changeItems(
                index,
                "thickness",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.applications.admin.weightPerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.applications.admin.enterWeightPerSquareMeter"
            )}
            style={clasess.textInputStyle}
            value={
              materialRollEncapsulationStateValue?.items[index][
                "weightPerSquareMeter"
              ]
            }
            onChange={(e: any) => {
              materialRollEncapsulationStateValue?.changeItems(
                index,
                "weightPerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { RollEncapsulationWeightsInputs };
