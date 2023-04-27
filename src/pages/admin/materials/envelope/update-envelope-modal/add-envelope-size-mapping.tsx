import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { materialEnvelopeState } from "../store/plat";
import { useStyle } from "./style";

const AddPlatSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialEnvelopeState);

  return (
    <>
      <div key={index} style={clasess.tableSecondSections}>
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
              {t("materials.envelops.admin.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterStock")}
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
              {t("materials.envelops.admin.quantityInPackage")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.envelops.admin.enterQuantityInPackage")}
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
          <div style={{ width: 193.6 }}>
            <div style={clasess.lableTextStyle}>
              {t("materials.envelops.admin.isWithWindow")}
            </div>
            <GoMakeAutoComplate
              options={[true, false]}
              style={clasess.textInputStyle}
              placeholder={t("materials.envelops.admin.enterisWithWindow")}
              value={materialPlatsStateValue?.items[index]["isWithWindow"]}
              onChange={(e: any, value: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "isWithWindow",
                  value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.defaultPrice")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterDefaultPrice")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.items[index]["defaultPrice"]}
              onChange={(e: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "defaultPrice",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPlatsStateValue?.setIsAddNewSheetWights(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialPlatsStateValue?.addNewPlatSizeByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.sheetPaper.admin.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddPlatSizeWeightsMapping };
