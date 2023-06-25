import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { SheetWeightsMapping } from "./sheet-weight-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const AddSheetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <GoMakeModal
        openModal={materialSheetsStateValue?.openAddSheetModal}
        modalTitle={t("materials.sheetPaper.admin.addNewSheet")}
        onClose={materialSheetsStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.inputs.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.inputs.categoryName")}
                style={clasess.textInputStyle}
                value={materialSheetsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialSheetsStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.sheetPaper.admin.sheetWeightsSection")}
              </div>
              <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialSheetsStateValue?.items];
                    temp.push({
                      weight: "",
                      name: "",
                      thickness: "",
                      index: "",
                      sheetSizes: [],
                    });
                    materialSheetsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.sheetPaper.admin.removeSheetWeight")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialSheetsStateValue?.items];
                    temp.pop();
                    materialSheetsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialSheetsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <SheetWeightsMapping
                    key={`SheetWeightsMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialSheetsStateValue?.addNewSupplierSheet}
            >
              {t("materials.sheetPaper.admin.addNewSheet")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddSheetModal };
