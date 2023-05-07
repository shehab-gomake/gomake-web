import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddPackingVolumeMapping } from "./add-packing-volume-mapping";
import { PackingVolumeMapping } from "./packing-volume-mapping";
import { materialPackingsState } from "../store/packings";
import { useStyle } from "./style";

const UpdatePacking = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);
  const selectedItem = materialPackingsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialPackingsStateValue?.openUpdatePlatModal}
        modalTitle={`${t("materials.packings.admin.edit")} ${
          selectedItem?.categoryName
        } ${t("materials.packings.admin.packing")}`}
        onClose={materialPackingsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packings.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packings.admin.categoryName")}
                style={clasess.textInputStyle}
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.packings.admin.packingsVolumnSection")}
              </div>
              {!materialPackingsStateValue?.isAddNewPackingVolume && (
                <Tooltip
                  title={t("materials.packings.admin.addNewPackingVolumn")}
                >
                  <IconButton
                    onClick={() => {
                      materialPackingsStateValue.setItems([
                        {
                          code: "",
                          width: "",
                          height: "",
                          length: "",
                          weight: "",
                          defaultPricePerUnit: "",
                        },
                      ]);
                      materialPackingsStateValue?.setIsAddNewPackingVolume(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialPackingsStateValue?.isAddNewPackingVolume && (
              <AddPackingVolumeMapping index={0} selectedItem={selectedItem} />
            )}
            {selectedItem?.packingVolumes?.map((item: any, index: number) => {
              return (
                <PackingVolumeMapping
                  key={`packingVolumeMapping_${index}`}
                  index={index}
                  item={item}
                  selectedItem={selectedItem}
                />
              );
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdatePacking };
