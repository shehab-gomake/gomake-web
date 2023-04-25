import { useTranslation } from "react-i18next";

import { GomakeTextInput } from "@/components";

import { SheetSizeMapping } from "./sheet-size-mapping";
import { useStyle } from "./style";

const SheetWeightsMapping = ({ index, item }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterWeight")}
              style={clasess.textInputStyle}
              value={item?.weight}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItems(
              //     index,
              //     "weight",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterName")}
              style={clasess.textInputStyle}
              value={item?.name}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItems(
              //     index,
              //     "name",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={item?.thickness}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItems(
              //     index,
              //     "thickness",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterIndex")}
              style={clasess.textInputStyle}
              value={item?.index}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItems(
              //     index,
              //     "index",
              //     e.target.value
              //   );
              // }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.sheetPaper.admin.sheetSizeSection")}
          </div>
        </div>
        {item?.sheetSizes?.map((item: any, index2: number) => {
          return (
            <SheetSizeMapping
              key={`SheetSizeMapping_${index2}`}
              index={index2}
              sheetWeightIndex={index}
              sheetSize={item}
            />
          );
        })}
      </div>
    </>
  );
};
export { SheetWeightsMapping };
