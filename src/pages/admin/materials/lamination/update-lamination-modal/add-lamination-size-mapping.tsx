import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { AddLaminationThicknessMapping } from "./add-lamination-thicknesses-mapping";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";
import { useCallback, useEffect, useMemo, useState } from "react";

const AddLaminationSizeMapping = ({ index, selectedItem }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  const [fit, setFit] = useState([]);
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
      <div key={index} style={clasess.tableSecondSections}>
        <div style={clasess.mainWaightsContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.lamination.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.lamination.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={materialLaminationsStateValue?.items[index]["height"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItems(
                  index,
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
              value={materialLaminationsStateValue?.items[index]["name"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItems(
                  index,
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
              value={materialLaminationsStateValue?.items[index]["width"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItems(
                  index,
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
              value={materialLaminationsStateValue?.items[index]["code"]}
              onChange={(e: any) => {
                materialLaminationsStateValue?.changeItems(
                  index,
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
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.lamination.admin.laminationThicknessSection")}
          </div>
          <Tooltip
            title={t("materials.lamination.admin.addNewLaminationThickness")}
          >
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialLaminationsStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.push({
                  code: "",
                  coldOrHot: "",
                  defaultPrice: "",
                  thickness: "",
                });
                materialLaminationsStateValue?.changeItems(
                  index,
                  "laminationThicknesses",
                  temp
                );
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("materials.sheetPaper.admin.removeSheetSize")}>
            <IconButton
              onClick={() => {
                const temp = [
                  ...materialLaminationsStateValue?.items[index][
                    "laminationThicknesses"
                  ],
                ];
                temp.pop();
                materialLaminationsStateValue?.changeItems(
                  index,
                  "laminationThicknesses",
                  temp
                );
              }}
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </div>
        {materialLaminationsStateValue?.items[index][
          "laminationThicknesses"
        ]?.map((item: any, index2: number) => {
          return (
            <AddLaminationThicknessMapping
              key={`laminationSizesMapping_${index2}`}
              index={index2}
              laminationSizeIndex={index}
              laminationThickness={
                materialLaminationsStateValue?.items[index][
                  "laminationThicknesses"
                ]
              }
            />
          );
        })}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialLaminationsStateValue?.setIsAddNewLaminationSizes(false)
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.sheetPaper.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialLaminationsStateValue?.addNewSheeWeightByCategoryName(
                  selectedItem
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.sheetPaper.admin.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddLaminationSizeMapping };
