import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddSheetWeightsMapping } from "./add-wide-format-material-type-mapping";
import { SheetWeightsMapping } from "./wide-format-material-type-mapping";
import { materialSheetsState } from "../store/sheets";
import { useStyle } from "./style";

const UpdateSheetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);
  const selectedItem = materialSheetsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialSheetsStateValue?.openUpdateSheetModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Wide Fromat Material`}
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
                      materialSheetsStateValue.setItems([
                        {
                          name: "",
                          weightPerMeterSquare: "",
                          thickness: "",
                          hardness: "",
                          index: "",
                          wideFormatMaterialSizes: [
                            {
                              code: "",
                              name: "",
                              width: "",
                              height: "",
                              defaultPricePerMeterSquare: "",
                              index: "",
                            },
                          ],
                        },
                      ]);
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
            {selectedItem?.wideFormatMaterialTypes?.map(
              (item: any, index: number) => {
                return (
                  <SheetWeightsMapping
                    key={`SheetWeightsMapping_${index}`}
                    index={index}
                    item={item}
                    selectedItem={selectedItem}
                  />
                );
              }
            )}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateSheetModal };
