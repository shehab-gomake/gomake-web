import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const SheetSizeInputs = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div style={clasess.inputSizesContainer}>
        {/* <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
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
        </div> */}
        {/* <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["name"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div> */}
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["width"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "width",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterHeight")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["height"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPricePerTon")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerTon")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPricePerTon"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "defaultPricePerTon",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDefaultPricePerUnit")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPricePerUnit"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "defaultPricePerUnit",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.direction")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterDirection")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["direction"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "direction",
                e.target.value
              );
            }}
          />
        </div>
        {/* <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.index")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterIndex")}
            style={clasess.textInputStyle}
            value={sheetSize[index]["index"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "index",
                e.target.value
              );
            }}
          />
        </div> */}
      </div>
    </>
  );
};
export { SheetSizeInputs };
