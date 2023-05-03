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

import { RollEncapsulationThicknesssMapping } from "./roll-encapsulation-thickness-mapping";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";
import { useStyle } from "./style";

const AddRollEncapsulationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

  return (
    <>
      <GoMakeModal
        openModal={
          materialRollEncapsulationStateValue?.openAddRollEncapsulationModal
        }
        modalTitle={t(
          "materials.encapsulationRoll.admin.addNewRollEncapsulation"
        )}
        onClose={materialRollEncapsulationStateValue?.onCloseModalAdded}
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
                value={materialRollEncapsulationStateValue?.categoryName}
                onChange={(e: any) => {
                  materialRollEncapsulationStateValue?.setCategoryName(
                    e.target.value
                  );
                }}
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
              <Tooltip
                title={t(
                  "materials.encapsulationRoll.admin.addRollEncapsulationThickness"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialRollEncapsulationStateValue?.items,
                    ];
                    temp.push({
                      code: "",
                      name: "",
                      thickness: "",
                      weightPerSquareMeter: "",
                      rollEncapsulationSizes: [],
                    });
                    materialRollEncapsulationStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.encapsulationRoll.admin.removeRollEncapsulationThickness"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialRollEncapsulationStateValue?.items,
                    ];
                    temp.pop();
                    materialRollEncapsulationStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialRollEncapsulationStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <RollEncapsulationThicknesssMapping
                    key={`RollEncapsulationThicknesssMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addRollEncapsulationBtnContainer}>
            <GomakePrimaryButton
              onClick={
                materialRollEncapsulationStateValue?.addNewSupplierRollEncapsulation
              }
            >
              {t("materials.encapsulationRoll.admin.addNewRollEncapsulation")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddRollEncapsulationModal };
