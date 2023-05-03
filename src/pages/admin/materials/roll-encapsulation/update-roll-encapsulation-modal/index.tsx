import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddSheetWeightsMapping } from "./add-roll-encapsulation-thickness-mapping";
import { SheetWeightsMapping } from "./roll-encapsulation-thickness-mapping";
import { materialSheetsState } from "../store/roll-encapsulation";
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
                {t(
                  "materials.encapsulationRoll.admin.rollEncapsulationThicknessSection"
                )}
              </div>
              {!materialSheetsStateValue?.isAddNewSheetWights && (
                <Tooltip
                  title={t(
                    "materials.encapsulationRoll.admin.addRollEncapsulationThickness"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialSheetsStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          thickness: "",
                          weightPerSquareMeter: "",
                          rollEncapsulationSizes: [
                            {
                              code: "",
                              width: "",
                              height: "",
                              name: "",
                              defaultPricePerSquareMeter: "",
                              fitToPrintType: [],
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
            {selectedItem?.rollEncapsulationThicknesses?.map(
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
