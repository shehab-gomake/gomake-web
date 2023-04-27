import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";

const LaminationThicknessesMapping = ({
  index,
  laminationSize,
  laminationThicknes,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterCode")}
              style={clasess.textInputStyle}
              value={laminationThicknes[index]["code"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItemsSheetSize(
                  laminationSize,
                  index,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.coldOrHot")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterColdOrHot")}
              style={clasess.textInputStyle}
              value={laminationThicknes[index]["coldOrHot"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItemsSheetSize(
                  laminationSize,
                  index,
                  "coldOrHot",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterDefaultPrice")}
              style={clasess.textInputStyle}
              value={laminationThicknes[index]["defaultPrice"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItemsSheetSize(
                  laminationSize,
                  index,
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={laminationThicknes[index]["thickness"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItemsSheetSize(
                  laminationSize,
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
export { LaminationThicknessesMapping };
