import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton, GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const AddPlatSizeWeightsMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

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
              {t("materials.tubes.admin.lenght")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterLenght")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.items[index]["lenght"]}
              onChange={(e: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "lenght",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.tubes.admin.diameter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterDiameter")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.items[index]["diameter"]}
              onChange={(e: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "diameter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.tubes.admin.weight")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.tubes.admin.enterWeight")}
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
