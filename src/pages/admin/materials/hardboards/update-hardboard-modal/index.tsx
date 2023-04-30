import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddHardboardSizeMapping } from "./add-hardboard-size-mapping";
import { HardboardSizesMapping } from "./hardboard-size-mapping";
import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";

const UpdatalHardboardModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );
  const selectedItem = materialHardboardsStateValue?.selectedEditItem;
  return (
    <>
      <GoMakeModal
        openModal={materialHardboardsStateValue?.openUpdateHardboardModal}
        modalTitle={`${t("materials.hardboards.admin.edit")} ${
          selectedItem?.categoryName
        } ${t("materials.hardboards.admin.hardboard")}`}
        onClose={materialHardboardsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div style={{ display: "flex", gap: 25 }}>
              <div>
                <div style={clasess.lableTextStyle}>
                  {t("materials.hardboards.admin.categoryName")}
                </div>
                <GomakeTextInput
                  placeholder={t("materials.hardboards.admin.categoryName")}
                  style={clasess.textInputStyle}
                  value={selectedItem?.categoryName}
                  disabled={true}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>
                  {t("materials.hardboards.admin.hardness")}
                </div>
                <GomakeTextInput
                  placeholder={t("materials.hardboards.admin.hardness")}
                  style={clasess.textInputStyle}
                  value={selectedItem?.hardness}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.hardboards.admin.hardboardSizesSection")}
              </div>
              {!materialHardboardsStateValue?.isAddNewHardboardSizes && (
                <Tooltip
                  title={t("materials.hardboards.admin.addNewHardboardSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialHardboardsStateValue?.setIsAddNewHardboardSizes(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialHardboardsStateValue?.isAddNewHardboardSizes && (
              <AddHardboardSizeMapping index={0} selectedItem={selectedItem} />
            )}
            {selectedItem?.hardboardSizes?.map((item: any, index: number) => {
              return (
                <HardboardSizesMapping
                  key={`HardboardSizesMapping_${index}`}
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
export { UpdatalHardboardModal };
