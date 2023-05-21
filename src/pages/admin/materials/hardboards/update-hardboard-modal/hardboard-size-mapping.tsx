import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { HardboardThicknessesMapping } from "./hardboard-thicknesses-mapping";
import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddHardboardThicknessMapping } from "./add-hardboard-thicknesses-mapping";
import { AddHardboardSizeMapping } from "./add-hardboard-size-mapping";
import { AddSheetWeightSizeMapping } from "./add-hardboard-size-thickness-mapping";

const HardboardSizesMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
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
            materialHardboardsStateValue.deleteHardboardSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialHardboardsStateValue.UpdateHardboardSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.hardboards.admin.deleteHardboardSizeTitle")}
          subTitle={t(
            "materials.hardboards.admin.deleteLHardboardSizeSubTitle"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[item?.id]?.height
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  item?.id,
                  "height",
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
              value={materialHardboardsStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  item?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWidth")}
              style={clasess.textInputStyle}
              value={materialHardboardsStateValue?.updateState[item?.id]?.width}
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  item?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.hardboards.admin.hardboardThicknessesSection")}
          </div>
          <Tooltip
            title={t("materials.hardboards.admin.addHardboardThickness")}
          >
            <IconButton
              onClick={() =>
                materialHardboardsStateValue.onClickOpenHardboardSizeThicknessWidget(
                  item
                )
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        {materialHardboardsStateValue?.isAddNewHardboardSizeThickness &&
          materialHardboardsStateValue?.selectedHardboardSizeThicknes.id ===
            item?.id && (
            <AddSheetWeightSizeMapping
              key={`AddSheetWeightSizeMapping_${item?.id}`}
              index={0}
              selectedItem={selectedItem}
              hardboardThickness={item}
            />
          )}
        {item?.hardboardThicknesses?.map((item2: any, index2: number) => {
          return (
            <HardboardThicknessesMapping
              key={`HardboardThicknessesMapping_${index2}`}
              index={index2}
              hardboardSize={item}
              hardboardThicknes={item2}
              selectedItem={selectedItem}
            />
          );
        })}
      </div>
    </>
  );
};
export { HardboardSizesMapping };
