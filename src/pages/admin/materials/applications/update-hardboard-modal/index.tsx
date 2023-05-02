import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddApplicationThicknessMapping } from "./add-application-thickness-mapping";
import { ApplicationThicknessMapping } from "./application-thickness-mapping";
import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const UpdatalApplicationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );
  const selectedItem = materialApplicationsStateValue?.selectedEditItem;
  return (
    <>
      <GoMakeModal
        openModal={materialApplicationsStateValue?.openUpdatalApplicationModal}
        modalTitle={`${t("materials.applications.admin.edit")} ${
          selectedItem?.categoryName
        } ${t("materials.applications.admin.application")}`}
        onClose={materialApplicationsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.applications.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.hardboards.admin.categoryName")}
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
                  "materials.applications.admin.applicationThicknessesSection"
                )}
              </div>
              {!materialApplicationsStateValue?.isAddNewApplicationThickness && (
                <Tooltip
                  title={t(
                    "materials.applications.admin.addNewApplicationThicknesses"
                  )}
                >
                  <IconButton
                    onClick={() => {
                      materialApplicationsStateValue?.setIsAddNewApplicationThickness(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialApplicationsStateValue?.isAddNewApplicationThickness && (
              <AddApplicationThicknessMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.applicationThicknesses?.map(
              (item: any, index: number) => {
                return (
                  <ApplicationThicknessMapping
                    key={`ApplicationThicknessMapping_${index}`}
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
export { UpdatalApplicationModal };
