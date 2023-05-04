import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddPackinDrumSizeWeightsMapping } from "./add-packin-drum-size-mapping";
import { PackinDrumWeightsMapping } from "./packin-drum-size-mapping";
import { materialPackinDrumState } from "../store/packin-drum";
import { useStyle } from "./style";

const UpdatePackinDrumModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinDrumStateValue = useRecoilValue<any>(
    materialPackinDrumState
  );
  const selectedItem = materialPackinDrumStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialPackinDrumStateValue?.openUpdatePackinDrumModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Packin Drum`}
        onClose={materialPackinDrumStateValue?.onCloseUpdateModal}
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
                {t("materials.packinDrums.admin.packinDrumSizeSection")}
              </div>
              {!materialPackinDrumStateValue?.isAddNewPackinDrumWights && (
                <Tooltip
                  title={t("materials.packinDrums.admin.addPackinDrumSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialPackinDrumStateValue.setItems([
                        {
                          code: "",
                          material: "",
                          size: "",
                          sizeName: "",
                          drumRingNumber: "",
                          weight: "",
                          defaultPricePerDrum: "",
                        },
                      ]);
                      materialPackinDrumStateValue?.setIsAddNewPackinDrumWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialPackinDrumStateValue?.isAddNewPackinDrumWights && (
              <AddPackinDrumSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.packinDrumSizes?.map((item: any, index: number) => {
              return (
                <PackinDrumWeightsMapping
                  key={`platSizeMapping_${index}`}
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
export { UpdatePackinDrumModal };
