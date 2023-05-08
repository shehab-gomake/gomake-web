import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddTubeSizeWeightsMapping } from "./add-tube-size-mapping";
import { TubeWeightsMapping } from "./tube-size-mapping";
import { materialTubeState } from "../store/tube";
import { useStyle } from "./style";

const UpdateTubeModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);
  const selectedItem = materialTubeStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialTubeStateValue?.openUpdateTubeModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Tube`}
        onClose={materialTubeStateValue?.onCloseUpdateModal}
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
              {!materialTubeStateValue?.isAddNewTubeWights && (
                <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
                  <IconButton
                    onClick={() => {
                      materialTubeStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          lenght: "",
                          diameter: "",
                          weight: "",
                          defaultPrice: "",
                        },
                      ]);
                      materialTubeStateValue?.setIsAddNewTubeWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialTubeStateValue?.isAddNewTubeWights && (
              <AddTubeSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.tubeSizes?.map((item: any, index: number) => {
              return (
                <TubeWeightsMapping
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
export { UpdateTubeModal };
