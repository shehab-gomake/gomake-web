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
              {t("materials.hardboards.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterCode")}
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
              {t("materials.hardboards.admin.defaultPricePerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.hardboards.admin.enterDefaultPricePerSquareMeter"
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
              {t("materials.hardboards.admin.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterIndex")}
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
              {t("materials.hardboards.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterName")}
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
              {t("materials.hardboards.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterThickness")}
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
        </div>
      </div>
    </>
  );
};
export { HardboardThicknessesMapping };
