import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { LaminationThicknessesMapping } from "./lamination-thicknesses-mapping";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";
import { useCallback, useEffect, useMemo, useState } from "react";

const LaminationSizesMapping = ({ index, item, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [fit, setFit] = useState([]);
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  const onChangeFit = useCallback(async (e: any, value: any) => {
    setFit(value);
  }, []);
  useEffect(() => {
    const mappedFit = fit.map((item) => item.lable);
    materialLaminationsStateValue?.changeItems(
      index,
      "fitToPrintType",
      mappedFit
    );
  }, [fit]);
  const muliSelectOptions = useMemo(() => {
    return [
      { lable: "String1", id: 1 },
      { lable: "String2", id: 2 },
      { lable: "String3", id: 3 },
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
            materialLaminationsStateValue.deleteLaminationSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          onClickUpdate={() =>
            materialLaminationsStateValue.updateLaminationSize(
              item?.id,
              selectedItem?.categoryName
            )
          }
          title={t("materials.lamination.admin.deleteLaminationSizeTitle")}
          subTitle={t(
            "materials.lamination.admin.deleteLaminationSizeSubTitle"
          )}
        />
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialLaminationsStateValue?.updateState[item?.id]?.height
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
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
              value={materialLaminationsStateValue?.updateState[item?.id]?.name}
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
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
              value={
                materialLaminationsStateValue?.updateState[item?.id]?.width
              }
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
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
              value={materialLaminationsStateValue?.updateState[item?.id]?.code}
              onChange={(e: any) => {
                materialLaminationsStateValue?.onChangeUpdateStateSheetWeights(
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
            <GoMakeAutoComplate
              options={muliSelectOptions}
              style={clasess.multiSelectStyle}
              placeholder={t("materials.lamination.admin.fitToPrintType")}
              multiple
              getOptionLabel={(option: any) => option.lable}
              onChange={onChangeFit}
              //defaultValue={
              // materialLaminationsStateValue?.updateState[item?.id]
              // ?.fitToPrintType[0]
              // }

              value={
                materialLaminationsStateValue?.updateState[item?.id]
                  ?.fitToPrintType
              }
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
