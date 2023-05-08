import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useStyle } from "../add-new-sheet-encapsulation-modal/style";

const SheetEncapsulationSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.code")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterCode")}
            style={clasess.textInputStyle}
            value={materialSheetEncapsulationStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "code",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetEncapsulation.admin.thickness")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetEncapsulation.admin.enterThickness")}
            style={clasess.textInputStyle}
            value={
              materialSheetEncapsulationStateValue?.items[index]["thickness"]
            }
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "thickness",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetEncapsulation.admin.weight")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetEncapsulation.admin.enterWeight")}
            style={clasess.textInputStyle}
            value={materialSheetEncapsulationStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "weight",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.inputs.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterWidth")}
            style={clasess.textInputStyle}
            value={materialSheetEncapsulationStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
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
            value={materialSheetEncapsulationStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>{t("materials.inputs.name")}</div>
          <GomakeTextInput
            placeholder={t("materials.inputs.enterName")}
            style={clasess.textInputStyle}
            value={materialSheetEncapsulationStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetEncapsulation.admin.quantityInPackage")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.sheetEncapsulation.admin.enterQuantityInPackage"
            )}
            style={clasess.textInputStyle}
            value={
              materialSheetEncapsulationStateValue?.items[index][
                "quantityInPackage"
              ]
            }
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "quantityInPackage",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetEncapsulation.admin.defaultPricePerUnit")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.sheetEncapsulation.admin.enterDefaultPricePerUnit"
            )}
            style={clasess.textInputStyle}
            value={
              materialSheetEncapsulationStateValue?.items[index][
                "defaultPricePerUnit"
              ]
            }
            onChange={(e: any) => {
              materialSheetEncapsulationStateValue?.changeItems(
                index,
                "defaultPricePerUnit",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { SheetEncapsulationSizeInputs };
