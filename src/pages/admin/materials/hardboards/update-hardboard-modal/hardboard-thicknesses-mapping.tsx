import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";

const HardboardThicknessesMapping = ({
  index,
  hardboardThicknes,
  hardboardSize,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialHardboardsStateValue.deletelHardboardSizeThickness(
              selectedItem?.categoryName,
              hardboardThicknes?.id,
              hardboardSize?.id
            )
          }
          item={hardboardThicknes}
          onClickUpdate={() =>
            materialHardboardsStateValue.updateHardboardSizeThickness(
              selectedItem?.categoryName,
              hardboardThicknes?.id,
              hardboardSize?.id
            )
          }
          title={t(
            "materials.hardboards.admin.deleteHardboardSizetTicknessTitle"
          )}
          subTitle={t(
            "materials.hardboards.admin.deleteHardboardSizethicknessSubTitle"
          )}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[hardboardThicknes?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  hardboardThicknes?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.admin.defaultPricePerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.hardboards.admin.enterDefaultPricePerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[hardboardThicknes?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  hardboardThicknes?.id,
                  "defaultPricePerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.admin.index")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterIndex")}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[hardboardThicknes?.id]
                  ?.index
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  hardboardThicknes?.id,
                  "index",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterName")}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[hardboardThicknes?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  hardboardThicknes?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.hardboards.admin.thickness")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.hardboards.admin.enterThickness")}
              style={clasess.textInputStyle}
              value={
                materialHardboardsStateValue?.updateState[hardboardThicknes?.id]
                  ?.thickness
              }
              onChange={(e: any) => {
                materialHardboardsStateValue?.onChangeUpdateStateHardboardWeights(
                  hardboardThicknes?.id,
                  "thickness",
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
export { HardboardThicknessesMapping };
