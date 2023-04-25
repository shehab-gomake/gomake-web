import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";
import { ControlIconsWidget } from "./control-icons-widget";

const SheetSizeMapping = ({
  index,
  sheetWeightIndex,
  sheetSize,
  sheetWeight,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

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
          onClickUpdate
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
              value={sheetSize?.code}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "code",
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
              value={sheetSize?.name}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "name",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={sheetSize?.width}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "width",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={sheetSize?.height}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "height",
              //     e.target.value
              //   );
              // }}
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
              value={sheetSize?.defaultPricePerTon}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "defaultPricePerTon",
              //     e.target.value
              //   );
              // }}
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
              value={sheetSize?.defaultPricePerUnit}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "defaultPricePerUnit",
              //     e.target.value
              //   );
              // }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.direction")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterDirection")}
              style={clasess.textInputStyle}
              value={sheetSize?.direction}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "direction",
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
              value={sheetSize?.index}
              // onChange={(e: any) => {
              //   materialSheetsStateValue?.changeItemsSheetSize(
              //     sheetWeightIndex,
              //     index,
              //     "index",
              //     e.target.value
              //   );
              // }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { SheetSizeMapping };
