import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddMaterialRollPrintingSizeWeightsMapping } from "./add-material-roll-printing-size-mapping";
import { MaterialRollPrintingWeightsMapping } from "./material-roll-printing-mapping";
import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useStyle } from "./style";

const UpdateMaterialRollPrintingModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );
  const selectedItem = materialMaterialRollPrintingStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={
          materialMaterialRollPrintingStateValue?.openUpdateMaterialRollPrintingModal
        }
        modalTitle={`Edit ${selectedItem?.categoryName} Material Roll Printing`}
        onClose={materialMaterialRollPrintingStateValue?.onCloseUpdateModal}
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
                  "materials.printingMaterials.admin.materialRollPrintingSizeSection"
                )}
              </div>
              {!materialMaterialRollPrintingStateValue?.isAddNewMaterialRollPrintingWights && (
                <Tooltip
                  title={t(
                    "materials.printingMaterials.admin.addNewMaterialRollPrintingSize"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialMaterialRollPrintingStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          width: "",
                          height: "",
                          weightPerSquareMeter: "",
                          withPremier: false,
                          stock: "",
                          defaultPricePerSquareMeter: "",
                        },
                      ]);
                      materialMaterialRollPrintingStateValue?.setIsAddNewMaterialRollPrintingWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialMaterialRollPrintingStateValue?.isAddNewMaterialRollPrintingWights && (
              <AddMaterialRollPrintingSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.materialRollPrintingSizes?.map(
              (item: any, index: number) => {
                return (
                  <MaterialRollPrintingWeightsMapping
                    key={`materialRollPrintingSizeMapping_${index}`}
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
export { UpdateMaterialRollPrintingModal };
