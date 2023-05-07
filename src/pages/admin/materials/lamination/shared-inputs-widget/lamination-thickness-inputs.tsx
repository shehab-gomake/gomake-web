import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/lamination";
import { useStyle } from "./style";

const SheetSizeInputs = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div style={clasess.inputSizesContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterCode")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["code"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "code",
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
            value={sheetSize[index]["thickness"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "thickness",
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
            value={sheetSize[index]["defaultPrice"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "defaultPrice",
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
            value={sheetSize[index]["coldOrHot"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "coldOrHot",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetSizeInputs };
