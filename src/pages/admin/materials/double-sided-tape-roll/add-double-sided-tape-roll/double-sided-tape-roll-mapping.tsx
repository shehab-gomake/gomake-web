import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";
import { materialDoublesidedTapeRollState } from "../store/double-sided-tape-roll";
import { useStyle } from "./style";

const DoubleSidedTapeRollMapping = ({ index }) => {
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
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.items[index]["code"]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
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
                materialDoublesidedTapeRollStateValue?.items[index]["name"]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
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
              value={
                materialDoublesidedTapeRollStateValue?.items[index]["width"]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.items[index]["height"]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.weightPerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterWeightPerSquareMeter")}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.items[index][
                  "weightPerSquareMeter"
                ]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
                  "weightPerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.inputs.defaultPricePerUnit")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.inputs.enterDefaultPricePerUnit")}
              style={clasess.textInputStyle}
              value={
                materialDoublesidedTapeRollStateValue?.items[index][
                  "defaultPricePerUnit"
                ]
              }
              onChange={(e: any) => {
                materialDoublesidedTapeRollStateValue?.changeItems(
                  index,
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
