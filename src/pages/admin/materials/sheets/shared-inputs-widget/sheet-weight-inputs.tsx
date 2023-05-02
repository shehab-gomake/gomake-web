import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const SheetWeightsInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={materialSheetsStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "weight",
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
            {t("materials.sheetPaper.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterThickness")}
            style={clasess.textInputStyle}
            value={materialSheetsStateValue?.items[index]["thickness"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "thickness",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.index")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterIndex")}
            style={clasess.textInputStyle}
            value={materialSheetsStateValue?.items[index]["index"]}
            onChange={(e: any) => {
              materialSheetsStateValue?.changeItems(
                index,
                "index",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetWeightsInputs };
