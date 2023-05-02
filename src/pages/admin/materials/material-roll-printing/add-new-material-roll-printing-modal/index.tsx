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

import { MaterialRollPrintingSizeMapping } from "./material-roll-printing-size-mapping";
import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useStyle } from "./style";

const AddNewMaterialRollPrintingModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMaterialRollPrintingsStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );

  return (
    <>
      <GoMakeModal
        openModal={
          materialMaterialRollPrintingsStateValue?.openAddNewMaterialRollPrintingModal
        }
        modalTitle={t(
          "materials.printingMaterials.admin.addNewMaterialRollPrinting"
        )}
        onClose={
          materialMaterialRollPrintingsStateValue?.onCloseAddNewMaterialRollPrintingModal
        }
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
                value={materialMaterialRollPrintingsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialMaterialRollPrintingsStateValue?.setCategoryName(
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
                  "materials.printingMaterials.admin.materialRollPrintingSizeSection"
                )}
              </div>
              <Tooltip
                title={t(
                  "materials.printingMaterials.admin.addNewMaterialRollPrintingSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialMaterialRollPrintingsStateValue?.items,
                    ];
                    temp.push({
                      code: "",
                      name: "",
                      width: "",
                      height: "",
                      weightPerSquareMeter: "",
                      withPremier: false,
                      stock: "",
                      defaultPricePerSquareMeter: "",
                    });
                    materialMaterialRollPrintingsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.printingMaterials.admin.removeMaterialRollPrintingSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialMaterialRollPrintingsStateValue?.items,
                    ];
                    temp.pop();
                    materialMaterialRollPrintingsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialMaterialRollPrintingsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <MaterialRollPrintingSizeMapping
                    key={`platSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={
                materialMaterialRollPrintingsStateValue?.addNewMaterialRollPrintingsSize
              }
            >
              {t(
                "materials.printingMaterials.admin.addNewMaterialRollPrinting"
              )}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewMaterialRollPrintingModal };
