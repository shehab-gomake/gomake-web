import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";

const HardboardThicknessesMapping = ({
  index,
  hardboardSize,
  hardboardThicknes,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={hardboardThicknes[index]["code"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.defaultPricePerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.inputs.enterDefaultPricePerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={hardboardThicknes[index]["defaultPricePerSquareMeter"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "defaultPricePerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterIndex")}
              style={clasess.textInputStyle}
              value={hardboardThicknes[index]["index"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "index",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={hardboardThicknes[index]["name"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "name",
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
              value={hardboardThicknes[index]["thickness"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.inputs.stiffnessFactor")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.inputs.stiffnessFactor")}
              style={clasess.textInputStyle}
              value={hardboardThicknes[index]["stiffnessFactor"]}
              onChange={(e: any) => {
                materialHardboardsStateValue?.changeItemsHardboardnSize(
                  hardboardSize,
                  index,
                  "stiffnessFactor",
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
export { HardboardThicknessesMapping };
