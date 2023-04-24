import { useTranslation } from "react-i18next";

import { GomakeTextInput } from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { materialSheetsState } from "../store/sheets";

const SheetSizeMapping = ({ index, sheetWeightIndex, sheetSize }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>Code</div>
            <GomakeTextInput
              placeholder="Enter Code"
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
            <div style={clasess.lableTextStyle}>Width</div>
            <GomakeTextInput
              placeholder="Enter Width"
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
            <div style={clasess.lableTextStyle}>Height</div>
            <GomakeTextInput
              placeholder="Enter Height"
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
            <div style={clasess.lableTextStyle}>Default Price Per Ton</div>
            <GomakeTextInput
              placeholder="Enter Default Price Per Ton"
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
            <div style={clasess.lableTextStyle}>Default Price Per Unit</div>
            <GomakeTextInput
              placeholder="Enter Default Price Per Unit"
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
            <div style={clasess.lableTextStyle}>Direction</div>
            <GomakeTextInput
              placeholder="Enter Direction"
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
            <div style={clasess.lableTextStyle}>index</div>
            <GomakeTextInput
              placeholder="Enter index"
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
