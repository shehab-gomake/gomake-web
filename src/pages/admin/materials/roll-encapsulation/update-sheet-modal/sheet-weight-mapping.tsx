import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { ControlIconsWidget } from "./control-icons-widget";
import { SheetSizeMapping } from "./sheet-size-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";
import { AddSheetWeightSizeMapping } from "./add-sheet-weight-size-mapping";

const SheetWeightsMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
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
              {t("materials.sheetPaper.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={materialSheetsStateValue?.updateState[item?.id]?.thickness}
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "thickness",
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
                materialSheetsStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialSheetsStateValue?.onChangeUpdateStateSheetWeights(
                  item?.id,
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t(
              "materials.encapsulationRoll.admin.rollEncapsulationSizeSection"
            )}
          </div>

          <Tooltip
            title={t(
              "materials.encapsulationRoll.admin.addRollEncapsulationize"
            )}
          >
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
        {item?.rollEncapsulationSizes?.map((item2: any, index2: number) => {
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
