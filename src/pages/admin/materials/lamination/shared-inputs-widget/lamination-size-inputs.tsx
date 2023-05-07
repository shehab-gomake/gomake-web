import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/lamination";
import { useStyle } from "./style";
import { useMemo } from "react";

const SheetWeightsInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  const muliSelectOptions = useMemo(() => {
    return [
      { label: "String1", id: "String1" },
      { label: "String2", id: "String2" },
      { label: "String3", id: "String3" },
    ];
  }, []);
  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialSheetsStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "code",
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
            value={materialSheetsStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
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
            value={materialSheetsStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "height",
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
            value={materialSheetsStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "name",
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
            // getOptionLabel={(option: any) => option.lable}
            onChange={(e: any, value: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "fitToPrintType",
                value.map((item: any) => item?.label)
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetWeightsInputs };
