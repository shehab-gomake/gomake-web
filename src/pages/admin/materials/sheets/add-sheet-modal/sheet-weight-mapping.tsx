import { useTranslation } from "react-i18next";

import { GomakeTextInput } from "@/components";

import { useStyle } from "./style";

const SheetWeightsMapping = ({ index, items, changeItems }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={items[index]["weight"]}
            onChange={(e: any) => {
              changeItems(index, "weight", e.target.value);
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
            value={items[index]["name"]}
            onChange={(e: any) => {
              changeItems(index, "name", e.target.value);
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
            value={items[index]["thickness"]}
            onChange={(e: any) => {
              changeItems(index, "thickness", e.target.value);
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
            value={items[index]["index"]}
            onChange={(e: any) => {
              changeItems(index, "index", e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetWeightsMapping };
