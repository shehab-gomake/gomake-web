import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "../add-new-material-roll-printing-modal/style";

const RollPrintingSizeInputs = ({ index }) => {
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
            {t("materials.envelops.admin.width")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.envelops.admin.enterWidth")}
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
            {t("materials.envelops.admin.height")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.envelops.admin.enterHeight")}
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
            {t("materials.printingMaterials.admin.weightPerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.printingMaterials.admin.enterWeightPerSquareMeter"
            )}
            style={clasess.textInputStyle}
            value={
              materialPlatsStateValue?.items[index]["weightPerSquareMeter"]
            }
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "weightPerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
        <div style={{ width: 193.6 }}>
          <div style={clasess.lableTextStyle}>
            {t("materials.envelops.admin.isWithWindow")}
          </div>
          <GoMakeAutoComplate
            options={[true, false]}
            style={clasess.textInputStyle}
            placeholder={t(
              "materials.printingMaterials.admin.selectWithPremier"
            )}
            value={materialPlatsStateValue?.items[index]["withPremier"]}
            onChange={(e: any, value: any) => {
              materialPlatsStateValue?.changeItems(index, "withPremier", value);
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.printingMaterials.admin.stock")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.printingMaterials.admin.enterStock")}
            style={clasess.textInputStyle}
            value={materialPlatsStateValue?.items[index]["stock"]}
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "stock",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.printingMaterials.admin.defaultPricePerSquareMeter")}
          </div>
          <GomakeTextInput
            placeholder={t(
              "materials.printingMaterials.admin.enterDefaultPricePerSquareMeter"
            )}
            style={clasess.textInputStyle}
            value={
              materialPlatsStateValue?.items[index][
                "defaultPricePerSquareMeter"
              ]
            }
            onChange={(e: any) => {
              materialPlatsStateValue?.changeItems(
                index,
                "defaultPricePerSquareMeter",
                e.target.value
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { RollPrintingSizeInputs };
