import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { LaminationThicknessesMapping } from "./lamination-thicknesses-mapping";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";

const LaminationSizesMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <ControlIconsWidget
          t={t}
          item={item}
          onClickDelete={() =>
            materialSheetsStateValue.deleteLaminationSize(
              item?.id,
              selectedItem?.sizeId
            )
          }
          onClickUpdate={() =>
            materialSheetsStateValue.updateSheetweight(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={"Delete Sheet Weight"}
          subTitle={"Are you sure you want to delete sheet weight?"}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[item?.id]?.height}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterName")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterCode")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.fitToPrintType")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterFitToPrintType")}
              style={clasess.textInputStyle}
              value={
                materialSheetsStateValue?.updateState[item?.id]?.fitToPrintType
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "fitToPrintType",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.lamination.admin.laminationThicknessesSection")}
          </div>
        </div>
        {item?.laminationThicknesses?.map((item2: any, index2: number) => {
          return (
            <LaminationThicknessesMapping
              key={`LaminationThicknessesMapping_${index2}`}
              index={index2}
              laminationSize={item}
              laminationThicknes={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { LaminationSizesMapping };
