import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const SheetSizeMapping = ({ index, sheetSize, sheetWeight, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  console.log("sheetSize", sheetSize);
  console.log("sheetWeight", sheetWeight);
  console.log("selectedItem", selectedItem);
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialSheetsStateValue.deleteSheetweightSize(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          item={sheetSize}
          onClickUpdate={() =>
            materialSheetsStateValue.updateSheetWeightSizes(
              selectedItem?.categoryName,
              sheetWeight?.id,
              sheetSize?.id
            )
          }
          title={"Delete Sheet Weight Size"}
          subTitle={"Are you sure you want to delete sheet weight size?"}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterCode")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[sheetSize?.id]?.code}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
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
              value={materialSheetsStateValue?.updateState[sheetSize?.id]?.name}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
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
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]?.width
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
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
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]?.height
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
        </div>

        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.defaultPricePerTon")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetPaper.admin.enterDefaultPricePerTon"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]
                  ?.defaultPricePerTon
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
                  "defaultPricePerTon",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.defaultPricePerUnit")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.sheetPaper.admin.enterDefaultPricePerUnit"
              )}
              style={clasess.textInputStyle}
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]
                  ?.defaultPricePerUnit
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
                  "defaultPricePerUnit",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.direction")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterDirection")}
              style={clasess.textInputStyle}
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]?.direction
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
                  "direction",
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
              value={
                materialSheetsStateValue?.updateState[sheetSize?.id]?.index
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  sheetSize?.id,
                  "index",
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
export { SheetSizeMapping };
