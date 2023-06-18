import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddRollEncapsulationThicknesssMapping } from "./add-roll-encapsulation-thickness-mapping";
import { RollEncapsulationThicknesssMapping } from "./roll-encapsulation-thickness-mapping";
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
                {t("materials.inputs.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.inputs.categoryName")}
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
              {!materialRollEncapsulationStateValue?.isAddNewRollEncapsulationThickness && (
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
                      materialRollEncapsulationStateValue?.setIsAddNewRollEncapsulationThickness(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialRollEncapsulationStateValue?.isAddNewRollEncapsulationThickness && (
              <AddRollEncapsulationThicknesssMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.rollEncapsulationThicknesses?.map(
              (item: any, index: number) => {
                return (
                  <RollEncapsulationThicknesssMapping
                    key={`RollEncapsulationThicknesssMapping_${index}`}
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
