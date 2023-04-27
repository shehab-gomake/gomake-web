import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddLaminationSizeMapping } from "./add-lamination-size-mapping";
import { LaminationSizesMapping } from "./lamination-size-mapping";
import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";

const UpdateSheetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  const selectedItem = materialLaminationsStateValue?.selectedEditItem;
  return (
    <>
      <GoMakeModal
        openModal={materialLaminationsStateValue?.openUpdateLaminationModal}
        modalTitle={`${t("materials.lamination.admin.edit")} ${
          selectedItem?.categoryName
        } ${t("materials.lamination.admin.lamination")}`}
        onClose={materialLaminationsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.lamination.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.lamination.admin.categoryName")}
                style={clasess.textInputStyle}
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.lamination.admin.laminationSizesSection")}
              </div>
              {!materialLaminationsStateValue?.isAddNewLaminationSizes && (
                <Tooltip
                  title={t("materials.lamination.admin.addNewLaminationSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialLaminationsStateValue?.setIsAddNewLaminationSizes(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialLaminationsStateValue?.isAddNewLaminationSizes && (
              <AddLaminationSizeMapping index={0} selectedItem={selectedItem} />
            )}
            {selectedItem?.laminationSizes?.map((item: any, index: number) => {
              return (
                <LaminationSizesMapping
                  key={`LaminationSizesMapping_${index}`}
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
export { UpdateSheetModal };
