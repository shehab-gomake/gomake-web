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

import { materialWideFormatMaterialState } from "../store/wide-format-material";
import { useStyle } from "./style";
import { WideFormatMaterialWeightsMapping } from "./wide-format-material-type-mapping";

const AddWideFormatMaterialModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <GoMakeModal
        openModal={
          materialWideFormatMaterialStateValue?.openAddWideFormatMaterialModal
        }
        modalTitle={t(
          "materials.wideFormatMaterial.admin.addNewWideFormatMaterial"
        )}
        onClose={materialWideFormatMaterialStateValue?.onCloseModalAdded}
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
                value={materialWideFormatMaterialStateValue?.categoryName}
                onChange={(e: any) => {
                  materialWideFormatMaterialStateValue?.setCategoryName(
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
                  "materials.wideFormatMaterial.admin.WideFormatMaterialTypeSection"
                )}
              </div>
              <Tooltip
                title={t(
                  "materials.wideFormatMaterial.admin.addWideFormatMaterialType"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialWideFormatMaterialStateValue?.items,
                    ];
                    temp.push({
                      name: "",
                      weightPerMeterSquare: "",
                      thickness: "",
                      hardness: "",
                      index: "",
                      wideFormatMaterialSizes: [],
                    });
                    materialWideFormatMaterialStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.wideFormatMaterial.admin.removeWideFormatMaterialType"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [
                      ...materialWideFormatMaterialStateValue?.items,
                    ];
                    temp.pop();
                    materialWideFormatMaterialStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialWideFormatMaterialStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <WideFormatMaterialWeightsMapping
                    key={`WideFormatMaterialWeightsMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addWideFormatMaterialBtnContainer}>
            <GomakePrimaryButton
              onClick={
                materialWideFormatMaterialStateValue?.addNewSupplierWideFormatMaterial
              }
            >
              {t("materials.wideFormatMaterial.admin.addNewWideFormatMaterial")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddWideFormatMaterialModal };
