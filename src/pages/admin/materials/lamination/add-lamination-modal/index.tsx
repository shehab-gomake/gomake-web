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

import { LaminationWeightsMapping } from "./lamination-size-mapping";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";

const AddLaminationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialLaminationStateValue?.openAddLaminationModal}
        modalTitle={t("materials.lamination.admin.addNewLamination")}
        onClose={materialLaminationStateValue?.onCloseModalAdded}
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
                value={materialLaminationStateValue?.categoryName}
                onChange={(e: any) => {
                  materialLaminationStateValue?.setCategoryName(e.target.value);
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
                    const temp = [...materialLaminationStateValue?.items];
                    temp.push({
                      code: "",
                      width: "",
                      height: "",
                      name: "",
                      laminationThicknesses: [
                        {
                          code: "",
                          thickness: "",
                          defaultPrice: "",
                          coldOrHot: "",
                        },
                      ],
                      fitToPrintType: [],
                    });
                    materialLaminationStateValue?.setItems(temp);
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
                    const temp = [...materialLaminationStateValue?.items];
                    temp.pop();
                    materialLaminationStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialLaminationStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <LaminationWeightsMapping
                    key={`LaminationWeightsMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addLaminationBtnContainer}>
            <GomakePrimaryButton
              onClick={materialLaminationStateValue?.addNewSupplierLamination}
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
