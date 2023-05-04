import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddSheetEncapsulationSizeWeightsMapping } from "./add-sheet-encapsulation-size-mapping";
import { SheetEncapsulationWeightsMapping } from "./sheet-encapsulation-size-mapping";
import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useStyle } from "./style";

const UpdateSheetEncapsulationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );
  const selectedItem = materialSheetEncapsulationStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={
          materialSheetEncapsulationStateValue?.openUpdateSheetEncapsulationModal
        }
        modalTitle={`Edit ${selectedItem?.categoryName} SheetEncapsulation`}
        onClose={materialSheetEncapsulationStateValue?.onCloseUpdateModal}
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
                  "materials.sheetEncapsulation.admin.sheetEncapsulationSizeSection"
                )}
              </div>
              {!materialSheetEncapsulationStateValue?.isAddNewSheetEncapsulationWights && (
                <Tooltip
                  title={t(
                    "materials.sheetEncapsulation.admin.addSheetEncapsulationSize"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialSheetEncapsulationStateValue.setItems([
                        {
                          code: "",
                          thickness: "",
                          weight: "",
                          width: "",
                          height: "",
                          name: "",
                          quantityInPackage: "",
                          defaultPricePerUnit: "",
                        },
                      ]);
                      materialSheetEncapsulationStateValue?.setIsAddNewSheetEncapsulationWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialSheetEncapsulationStateValue?.isAddNewSheetEncapsulationWights && (
              <AddSheetEncapsulationSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.sheetEncapsulationSizes?.map(
              (item: any, index: number) => {
                return (
                  <SheetEncapsulationWeightsMapping
                    key={`platSizeMapping_${index}`}
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
export { UpdateSheetEncapsulationModal };
