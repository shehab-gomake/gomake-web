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

import { SheetEncapsulationSizeMapping } from "./sheet-encapsulation-size-mapping";
import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useStyle } from "./style";

const AddNewSheetEncapsulationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );

  return (
    <>
      <GoMakeModal
        openModal={
          materialSheetEncapsulationStateValue?.openAddNewSheetEncapsulationModal
        }
        modalTitle={t(
          "materials.sheetEncapsulation.admin.addNewSheetEncapsulation"
        )}
        onClose={
          materialSheetEncapsulationStateValue?.onCloseAddNewSheetEncapsulationModal
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
                value={materialSheetEncapsulationStateValue?.categoryName}
                onChange={(e: any) => {
                  materialSheetEncapsulationStateValue?.setCategoryName(
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
                  "materials.sheetEncapsulation.admin.sheetEncapsulationSizeSection"
                )}
              </div>
              <Tooltip
                title={t(
                  "materials.sheetEncapsulation.admin.addSheetEncapsulationSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialSheetEncapsulationStateValue?.items,
                    ];
                    temp.push({
                      code: "",
                      thickness: "",
                      weight: "",
                      width: "",
                      height: "",
                      name: "",
                      quantityInPackage: "",
                      defaultPricePerUnit: "",
                    });
                    materialSheetEncapsulationStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.sheetEncapsulation.admin.removeSheetEncapsulationSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialSheetEncapsulationStateValue?.items,
                    ];
                    temp.pop();
                    materialSheetEncapsulationStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialSheetEncapsulationStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <SheetEncapsulationSizeMapping
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
                materialSheetEncapsulationStateValue?.addNewSheetEncapsulationSize
              }
            >
              {t("materials.sheetEncapsulation.admin.addNewSheetEncapsulation")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewSheetEncapsulationModal };
