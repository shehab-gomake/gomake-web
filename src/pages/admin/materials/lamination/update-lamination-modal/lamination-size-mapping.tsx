import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { ControlIconsWidget } from "./control-icons-widget";
import { SheetSizeMapping } from "./lamination-thickness-mapping";
import { materialSheetsState } from "../store/lamination";
import { useStyle } from "./style";
import { AddSheetWeightSizeMapping } from "./add-lamination-size-thickness-mapping";
import { useMemo } from "react";

const SheetWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  const muliSelectOptions = useMemo(() => {
    return [
      { label: "String1", id: "String1" },
      { label: "String2", id: "String2" },
      { label: "String3", id: "String3" },
    ];
  }, []);
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
            materialSheetsStateValue.deleteSheetweight(
              item?.id,
              selectedItem?.categoryName
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
              {t("materials.sheetPaper.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterCode")}
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
              {t("materials.sheetPaper.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterWidth")}
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
              {t("materials.sheetPaper.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterIndex")}
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
              {t("materials.sheetPaper.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterName")}
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
              {t("materials.sheetPaper.admin.name")}
            </div>
            <GoMakeAutoComplate
              options={muliSelectOptions}
              style={clasess.multiSelectStyle}
              placeholder={t("materials.lamination.admin.fitToPrintType")}
              multiple={true}
              onChange={(e: any, value: any) => {
                console.log("item", value);
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "fitToPrintType",
                  value?.map((item: any) => item?.label)
                );
              }}
              {...(materialSheetsStateValue?.updateState[item?.id]
                ?.fitToPrintType
                ? {
                    value: materialSheetsStateValue?.updateState[
                      item?.id
                    ]?.fitToPrintType.map((item: any) => {
                      return {
                        label: item,
                        id: item,
                      };
                    }),
                  }
                : null)}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.lamination.admin.laminationThicknessSection")}
          </div>

          <Tooltip title={t("materials.lamination.admin.addNewLaminationSize")}>
            <IconButton
              onClick={() =>
                materialSheetsStateValue.onClickOpenSheetWeightSizeWidget(item)
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialSheetsStateValue?.isAddNewSheetWightSize &&
          materialSheetsStateValue?.selectedSheetWeightSize.id === item?.id && (
            <AddSheetWeightSizeMapping
              key={`SheetSizeMapping_${item?.id}`}
              index={0}
              sheetSize={item}
              selectedItem={selectedItem}
            />
          )}
        {item?.laminationThicknesses?.map((item2: any, index2: number) => {
          return (
            <SheetSizeMapping
              key={`SheetSizeMapping_${index2}`}
              index={index2}
              sheetWeight={item}
              sheetSize={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { SheetWeightsMapping };
