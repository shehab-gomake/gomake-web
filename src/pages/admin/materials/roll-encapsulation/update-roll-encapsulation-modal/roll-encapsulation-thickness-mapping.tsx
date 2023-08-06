import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, Tooltip } from "@mui/material";
import { GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { ControlIconsWidget } from "./control-icons-widget";
import { RollEncapsulationSizeMapping } from "./roll-encapsulation-thickness-size-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";
import { AddRollEncapsulationThicknessSizeMapping } from "./add-roll-encapsulation-thickness-size-mapping";

const RollEncapsulationThicknesssMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
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
            materialRollEncapsulationStateValue.deleteRollEncapsulationweight(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialRollEncapsulationStateValue.updateRollEncapsulationweight(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={"Delete RollEncapsulation Thickness"}
          subTitle={"Are you sure you want to delete sheet weight?"}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[item?.id]?.code
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  item?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterName")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[item?.id]?.name
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.thickness")} (µm)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterThickness")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[item?.id]
                  ?.thickness
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
                  item?.id,
                  "thickness",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weight")} (gm/m^2)
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.weight")}
              style={clasess.textInputStyle}
              value={
                materialRollEncapsulationStateValue?.updateState[item?.id]
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialRollEncapsulationStateValue?.onChangeUpdateStateRollEncapsulationThicknesss(
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
                materialRollEncapsulationStateValue.onClickOpenRollEncapsulationThicknessSizeWidget(
                  item
                )
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialRollEncapsulationStateValue?.isAddNewRollEncapsulationWightSize &&
          materialRollEncapsulationStateValue
            ?.selectedRollEncapsulationThicknessSize.id === item?.id && (
            <AddRollEncapsulationThicknessSizeMapping
              key={`RollEncapsulationSizeMapping_${item?.id}`}
              index={0}
              sheetSize={item}
              selectedItem={selectedItem}
            />
          )}
        {item?.rollEncapsulationSizes?.map((item2: any, index2: number) => {
          return (
            <RollEncapsulationSizeMapping
              key={`RollEncapsulationSizeMapping_${index2}`}
              index={index2}
              sheetThickness={item}
              sheetSize={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { RollEncapsulationThicknesssMapping };
