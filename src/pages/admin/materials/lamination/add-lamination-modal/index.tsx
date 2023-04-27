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

import { LaminationSizesMapping } from "./lamination-size-mapping";

import { useStyle } from "./style";
import { materialLaminationsState } from "../store/lamination";

const AddLaminationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialLaminationsStateValue?.openAddLaminationModal}
        modalTitle={t("materials.lamination.admin.addNewLamination")}
        onClose={materialLaminationsStateValue?.onCloseModalAdded}
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
                value={materialLaminationsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialLaminationsStateValue?.setCategoryName(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.lamination.admin.laminationSizesSection")}
              </div>
              <Tooltip
                title={t("materials.lamination.admin.addNewLaminationSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialLaminationsStateValue?.items];
                    temp.push({
                      code: "",
                      fitToPrintType: "",
                      height: "",
                      name: "",
                      width: "",
                      laminationThicknesses: [],
                    });
                    materialLaminationsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.lamination.admin.removeLaminationSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialLaminationsStateValue?.items];
                    temp.pop();
                    materialLaminationsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialLaminationsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <LaminationSizesMapping
                    key={`LaminationSizesMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialLaminationsStateValue?.addNewSupplierLamination}
            >
              {t("materials.lamination.admin.addNewLamination")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddLaminationModal };
