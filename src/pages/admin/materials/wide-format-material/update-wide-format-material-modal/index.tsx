import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddWideFormatMaterialWeightsMapping } from "./add-wide-format-material-type-mapping";
import { WideFormatMaterialWeightsMapping } from "./wide-format-material-type-mapping";
import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";

const UpdateWideFormatMaterialModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );
  const selectedItem = materialWideFormatMaterialStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={
          materialWideFormatMaterialStateValue?.openUpdateWideFormatMaterialModal
        }
        modalTitle={`Edit ${selectedItem?.categoryName} Wide Fromat Material`}
        onClose={materialWideFormatMaterialStateValue?.onCloseUpdateModal}
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
                  "materials.wideFormatMaterial.admin.WideFormatMaterialTypeSection"
                )}
              </div>
              {!materialWideFormatMaterialStateValue?.isAddNewWideFormatMaterialType && (
                <Tooltip
                  title={t(
                    "materials.wideFormatMaterial.admin.addWideFormatMaterialType"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialWideFormatMaterialStateValue.setItems([
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
                      materialWideFormatMaterialStateValue?.setIsAddNewWideFormatMaterialType(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialWideFormatMaterialStateValue?.isAddNewWideFormatMaterialType && (
              <AddWideFormatMaterialWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.wideFormatMaterialTypes?.map(
              (item: any, index: number) => {
                return (
                  <WideFormatMaterialWeightsMapping
                    key={`WideFormatMaterialWeightsMapping_${index}`}
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
export { UpdateWideFormatMaterialModal };
