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

import { ApplicationThicknessMapping } from "./application-thickness-mapping";

import { useStyle } from "./style";
import { materialApplicationsState } from "../store/applications";

const AddApplicationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialApplicationsStateValue?.openAddApplicationsModal}
        modalTitle={t("materials.applications.admin.addNewApplication")}
        onClose={materialApplicationsStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.applications.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.applications.admin.categoryName")}
                style={clasess.textInputStyle}
                value={materialApplicationsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialApplicationsStateValue?.setCategoryName(
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
                  "materials.applications.admin.applicationThicknessesSection"
                )}
              </div>
              <Tooltip
                title={t(
                  "materials.applications.admin.addNewApplicationThicknesses"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialApplicationsStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      thickness: "",
                      weightPerSquareMeter: "",
                      applicationSizes: [],
                    });
                    materialApplicationsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.applications.admin.removeApplicationThickness"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialApplicationsStateValue?.items];
                    temp.pop();
                    materialApplicationsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialApplicationsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <ApplicationThicknessMapping
                    key={`ApplicationThicknessMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={
                materialApplicationsStateValue?.addNewSupplierApplication
              }
            >
              {t("materials.applications.admin.addNewApplication")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddApplicationModal };
