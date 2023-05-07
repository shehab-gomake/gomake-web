import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";
import { useMemo } from "react";

const LaminationWeightsInputs = ({ index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  const muliSelectOptions = useMemo(() => {
    return [
      { label: "String1", id: "String1" },
      { label: "String2", id: "String2" },
      { label: "String3", id: "String3" },
    ];
  }, []);
  return (
    <>
      <div style={clasess.mainWaightsContainer}>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.sheetPaper.admin.code")}
          </div>
          <GomakeTextInput
            placeholder={t("materials.sheetPaper.admin.enterCode")}
            style={clasess.textInputStyle}
            value={materialLaminationStateValue?.items[index]["code"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItems(
                index,
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
            value={materialLaminationStateValue?.items[index]["width"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItems(
                index,
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
            placeholder={t("materials.sheetPaper.admin.enterHeight")}
            style={clasess.textInputStyle}
            value={materialLaminationStateValue?.items[index]["height"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItems(
                index,
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
            value={materialLaminationStateValue?.items[index]["name"]}
            onChange={(e: any) => {
              materialLaminationStateValue?.changeItems(
                index,
                "name",
                e.target.value
              );
            }}
          />
        </div>
        <div>
          <div style={clasess.lableTextStyle}>
            {t("materials.lamination.admin.fitToPrintType")}
          </div>
          <GoMakeAutoComplate
            options={muliSelectOptions}
            style={clasess.multiSelectStyle}
            placeholder={t("materials.lamination.admin.fitToPrintType")}
            multiple
            // getOptionLabel={(option: any) => option.lable}
            onChange={(e: any, value: any) => {
              materialLaminationStateValue?.changeItems(
                index,
                "fitToPrintType",
                value.map((item: any) => item?.label)
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
export { LaminationWeightsInputs };
