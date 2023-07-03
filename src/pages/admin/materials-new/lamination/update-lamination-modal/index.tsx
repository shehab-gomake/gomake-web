import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddLaminationWeightsMapping } from "./add-lamination-size-mapping";
import { LaminationWeightsMapping } from "./lamination-size-mapping";
import { materialLaminationState } from "../store/lamination";
import { useStyle } from "./style";

const UpdateLaminationNewModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );
  const selectedItem = materialLaminationStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialLaminationStateValue?.openUpdateLaminationModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Lamination`}
        onClose={materialLaminationStateValue?.onCloseUpdateModal}
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
                {t("materials.lamination.admin.laminationSizesSection")}
              </div>
              {!materialLaminationStateValue?.isAddNewLaminationWights && (
                <Tooltip
                  title={t("materials.lamination.admin.addNewLaminationSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialLaminationStateValue.setItems([
                        {
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
                        },
                      ]);
                      materialLaminationStateValue?.setIsAddNewLaminationWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialLaminationStateValue?.isAddNewLaminationWights && (
              <AddLaminationWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.laminationSizes?.map((item: any, index: number) => {
              return (
                <LaminationWeightsMapping
                  key={`LaminationWeightsMapping_${index}`}
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
export { UpdateLaminationNewModal };
