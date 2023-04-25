import { useTranslation } from "react-i18next";

import { GoMakeModal, GomakeTextInput } from "@/components";

import { SheetWeightsMapping } from "./sheet-weight-mapping";
import { useStyle } from "./style";
import { materialSheetsState } from "../store/sheets";
import { useRecoilValue } from "recoil";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AddSheetWeightsMapping } from "./add-sheet-weight-mapping";

const UpdateSheetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  const selectedItem = materialSheetsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialSheetsStateValue?.openUpdateSheetModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Sheet`}
        onClose={materialSheetsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.sheetPaper.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.sheetPaper.admin.categoryName")}
                style={clasess.textInputStyle}
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.sheetPaper.admin.sheetWeightsSection")}
              </div>
              {!materialSheetsStateValue?.isAddNewSheetWights && (
                <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
                  <IconButton
                    onClick={() => {
                      materialSheetsStateValue?.setIsAddNewSheetWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialSheetsStateValue?.isAddNewSheetWights && (
              <AddSheetWeightsMapping index={0} selectedItem={selectedItem} />
            )}
            {selectedItem?.sheetWeights?.map((item: any, index: number) => {
              return (
                <SheetWeightsMapping
                  key={`SheetWeightsMapping_${index}`}
                  index={index}
                  item={item}
                />
              );
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateSheetModal };
