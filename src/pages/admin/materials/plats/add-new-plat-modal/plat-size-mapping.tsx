import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const PlatSizeMapping = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.plat.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.plat.admin.enterCode")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.items[index]["code"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
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
              value={materialSheetsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
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
              value={materialSheetsStateValue?.items[index]["width"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
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
              value={materialSheetsStateValue?.items[index]["height"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "height",
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
              value={materialSheetsStateValue?.items[index]["defaultPrice"]}
              onChange={(e: any) => {
                materialSheetsStateValue?.changeItems(
                  index,
                  "defaultPrice",
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
export { PlatSizeMapping };
