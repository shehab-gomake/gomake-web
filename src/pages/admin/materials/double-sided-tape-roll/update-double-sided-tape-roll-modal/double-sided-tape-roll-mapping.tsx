import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialDoublesidedTapeRollState } from "../store/double-sided-tape-roll";
import { useStyle } from "./style";

const DoubleSidedTapeRollMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialDoublesidedTapeRollStateValue = useRecoilValue<any>(
    materialDoublesidedTapeRollState
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
            materialDoublesidedTapeRollStateValue.deleteDoubleSidedTapeRoll(
              item?.code
            )
          }
          onClickUpdate={() =>
            materialDoublesidedTapeRollStateValue.updateDoubleSidedTapeRoll(
              item?.code
            )
          }
          title={t(
            "materials.doubleSidedTapeRolls.admin.deleteDoubleSidedTapeRoll"
          )}
          subTitle={t(
            "materials.doubleSidedTapeRolls.admin.deletedoubleSidedTapeRollSubTitle"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.doubleSidedTapeRolls.admin.enteCode")}
              style={clasess.textInputStyle}
              value={materialDoublesidedTapeRollStateValue?.updateState?.name}
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.doubleSidedTapeRolls.admin.enterName")}
              style={clasess.textInputStyle}
              value={materialDoublesidedTapeRollStateValue?.updateState?.name}
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.doubleSidedTapeRolls.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={materialDoublesidedTapeRollStateValue?.updateState?.width}
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.doubleSidedTapeRolls.admin.enterHeight"
              )}
              style={clasess.textInputStyle}
              value={materialDoublesidedTapeRollStateValue?.updateState?.height}
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.doubleSidedTapeRolls.admin.enterWeightPerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.updateState
                  ?.weightPerSquareMeter
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.doubleSidedTapeRolls.admin.defaultPricePerUnit")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.doubleSidedTapeRolls.admin.enterDefaultPricePerUnit"
              )}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.updateState
                  ?.defaultPricePerUnit
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.onChangeUpdateStateDoubleSidedTapeRoll(
                  "defaultPricePerUnit",
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
export { DoubleSidedTapeRollMapping };
