import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { IconButton, TextField, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import AddIcon from "@mui/icons-material/Add";

import { LaminationThicknessesMapping } from "./lamination-thickness-mapping";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";
import { useCallback, useEffect, useMemo, useState } from "react";

const LaminationSizesMapping = ({ index }) => {
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
              style={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                height: "100%",
                display: "flex",
                alignitems: "center",
                justifyContent: "center",
              }}
              placeholder={t("materials.lamination.admin.fitToPrintType")}
              multiple
              getOptionLabel={(option: any) => option.lable}
              onChange={onChangeFit}
            />
          </div>
        </div>
        <div style={clasess.titlePlusContainer}>
          <div style={clasess.sizeSectionTitleStyle}>
            {t("materials.lamination.admin.laminationThicknessesSection")}
          </div>
          <Tooltip
            title={t("materials.lamination.admin.addNewLaminationThicknes")}
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
          <Tooltip
            title={t("materials.lamination.admin.removeLaminationThicknes")}
          >
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
            <LaminationThicknessesMapping
              key={`LaminationThicknessesMapping_${index2}`}
              index={index2}
              laminationSize={index}
              laminationThicknes={
                materialLaminationsStateValue?.items[index][
                  "laminationThicknesses"
                ]
              }
            />
          );
        })}
      </div>
    </>
  );
};
export { LaminationSizesMapping };
