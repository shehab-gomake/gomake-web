import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddProfileFrameSizeWeightsMapping } from "./add-profile-frame-size-mapping";
import { ProfileFrameWeightsMapping } from "./profile-frame-size-mapping";
import { materialProfileFrameState } from "../store/profile-frame";
import { useStyle } from "./style";

const UpdateProfileFrameModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
  );
  const selectedItem = materialProfileFrameStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialProfileFrameStateValue?.openUpdateProfileFrameModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Profile Frame`}
        onClose={materialProfileFrameStateValue?.onCloseUpdateModal}
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
                {t("materials.plat.admin.platSizeSection")}
              </div>
              {!materialProfileFrameStateValue?.isAddNewProfileFrameWights && (
                <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
                  <IconButton
                    onClick={() => {
                      materialProfileFrameStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          width: "",
                          height: "",
                          length: "",
                          stock: "",
                          defaultPricePerMeter: "",
                          defaultPricePerUnit: "",
                        },
                      ]);
                      materialProfileFrameStateValue?.setIsAddNewProfileFrameWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialProfileFrameStateValue?.isAddNewProfileFrameWights && (
              <AddProfileFrameSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.profileFrameSizes?.map(
              (item: any, index: number) => {
                return (
                  <ProfileFrameWeightsMapping
                    key={`profileFrameSizeMapping_${index}`}
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
export { UpdateProfileFrameModal };
