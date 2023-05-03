import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddRollEncapsulationWeightsMapping } from "./add-roll-encapsulation-thickness-mapping";
import { RollEncapsulationWeightsMapping } from "./roll-encapsulation-thickness-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";

const UpdateRollEncapsulationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );
  const selectedItem = materialRollEncapsulationStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={
          materialRollEncapsulationStateValue?.openUpdateRollEncapsulationModal
        }
        modalTitle={`Edit ${selectedItem?.categoryName} RollEncapsulation`}
        onClose={materialRollEncapsulationStateValue?.onCloseUpdateModal}
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
              {!materialRollEncapsulationStateValue?.isAddNewRollEncapsulationWights && (
                <Tooltip
                  title={t(
                    "materials.encapsulationRoll.admin.addRollEncapsulationThickness"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialRollEncapsulationStateValue.setItems([
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
                      materialRollEncapsulationStateValue?.setIsAddNewRollEncapsulationWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialRollEncapsulationStateValue?.isAddNewRollEncapsulationWights && (
              <AddRollEncapsulationWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.rollEncapsulationThicknesses?.map(
              (item: any, index: number) => {
                return (
                  <RollEncapsulationWeightsMapping
                    key={`RollEncapsulationWeightsMapping_${index}`}
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
export { UpdateRollEncapsulationModal };
