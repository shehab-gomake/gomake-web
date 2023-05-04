import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/sheet-encapsulation";
import { useStyle } from "../add-new-sheet-encapsulation-modal/style";

const PlatSizeInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["thickness"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["weight"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "weight",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterWidth")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "width",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterHeight")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "height",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.plat.admin.name")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.plat.admin.enterName")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["quantityInPackage"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
            value={materialPlatsStateValue?.items[index]["defaultPricePerUnit"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
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
export { PlatSizeInputs };
