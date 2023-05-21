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

import { HardboardSizesMapping } from "./hardboard-size-mapping";

import { useStyle } from "./style";
import { materialHardboardsState } from "../store/hardboards";

const AddLaminationModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialHardboardsStateValue?.openAddHardboardsModal}
        modalTitle={t("materials.hardboards.admin.addNewHardboard")}
        onClose={materialHardboardsStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div style={{ display: "flex", gap: 25 }}>
              <div>
                <div style={clasess.lableTextStyle}>
                  {t("materials.inputs.categoryName")}
                </div>
                <GomakeTextInput
                  placeholder={t("materials.inputs.categoryName")}
                  style={clasess.textInputStyle}
                  value={materialHardboardsStateValue?.categoryName}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.setCategoryName(
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>
                  {t("materials.hardboards.admin.hardness")}
                </div>
                <GomakeTextInput
                  placeholder={t("materials.hardboards.admin.hardness")}
                  style={clasess.textInputStyle}
                  value={materialHardboardsStateValue?.hardness}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.setHardness(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.hardboards.admin.hardboardSizesSection")}
              </div>
              <Tooltip
                title={t("materials.hardboards.admin.addNewHardboardSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialHardboardsStateValue?.items];
                    temp.push({
                      height: "",
                      name: "",
                      width: "",
                      hardboardThicknesses: [],
                    });
                    materialHardboardsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.hardboards.admin.removeHardboardSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialHardboardsStateValue?.items];
                    temp.pop();
                    materialHardboardsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialHardboardsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <HardboardSizesMapping
                    key={`HardboardSizesMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialHardboardsStateValue?.addNewSupplierHardboard}
            >
              {t("materials.hardboards.admin.addNewHardboard")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddLaminationModal };
