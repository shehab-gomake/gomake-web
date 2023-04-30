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
              {t("materials.profileFrames.admin.lenght")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.profileFrames.admin.enterLenght")}
              style={clasess.textInputStyle}
              value={materialPlatsStateValue?.items[index]["length"]}
              onChange={(e: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "length",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.profileFrames.admin.stock")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.profileFrames.admin.enterStock")}
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
              {t("materials.profileFrames.admin.defaultPricePerMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.profileFrames.admin.enterDefaultPricePerMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialPlatsStateValue?.items[index]["defaultPricePerMeter"]
              }
              onChange={(e: any) => {
                materialPlatsStateValue?.changeItems(
                  index,
                  "defaultPricePerMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.profileFrames.admin.defaultPricePerUnit")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.profileFrames.admin.enterDefaultPricePerUnit"
              )}
              style={clasess.textInputStyle}
              value={
                materialPlatsStateValue?.items[index]["defaultPricePerUnit"]
              }
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
