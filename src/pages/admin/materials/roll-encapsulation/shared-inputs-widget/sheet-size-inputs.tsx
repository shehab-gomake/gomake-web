import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";
import { useMemo } from "react";

const SheetSizeInputs = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  const muliSelectOptions = useMemo(() => {
    return [
      { lable: "String1", id: 1 },
      { lable: "String2", id: 2 },
      { lable: "String3", id: 3 },
    ];
  }, []);

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
            {t("materials.sheetPaper.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterName")}
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
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterWidth")}
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
            {t("materials.sheetPaper.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterHeight")}
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
            {t("materials.applications.admin.defaultPricePerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.applications.admin.enterDefaultPricePerSquareMeter"
            )}
            style={clasess.textInputStyle}
            value={sheetSize[index]["defaultPricePerSquareMeter"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "defaultPricePerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.lamination.admin.fitToPrintType")}
          </div>
          <GoMakeAutoComplate
            options={muliSelectOptions}
            style={clasess.multiSelectStyle}
            placeholder={t("materials.lamination.admin.fitToPrintType")}
            multiple
            getOptionLabel={(option: any) => option.lable}
            onChange={(e: any, value: any) => {
              materialSheetsStateValue?.changeItemsSheetSize(
                sheetWeightIndex,
                index,
                "fitToPrintType",
                value.map((item: any) => item?.lable)
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetSizeInputs };
