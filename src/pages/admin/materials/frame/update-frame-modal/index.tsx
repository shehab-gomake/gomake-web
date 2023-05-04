import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddFrameSizeWeightsMapping } from "./add-frame-size-mapping";
import { FrameWeightsMapping } from "./frame-size-mapping";
import { materialFrameState } from "../store/frame";
import { useStyle } from "./style";

const UpdateFrameModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);
  const selectedItem = materialFrameStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialFrameStateValue?.openUpdateFrameModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Frame`}
        onClose={materialFrameStateValue?.onCloseUpdateModal}
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
                {t("materials.frames.admin.frameSizeSection")}
              </div>
              {!materialFrameStateValue?.isAddNewFrameWights && (
                <Tooltip title={t("materials.plat.admin.addFrameSize")}>
                  <IconButton
                    onClick={() => {
                      materialFrameStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          color: "",
                          width: "",
                          height: "",
                          thickness: "",
                          weight: "",
                          stock: "",
                          defaultPrice: "",
                        },
                      ]);
                      materialFrameStateValue?.setIsAddNewFrameWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialFrameStateValue?.isAddNewFrameWights && (
              <AddFrameSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.frameSizes?.map((item: any, index: number) => {
              return (
                <FrameWeightsMapping
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
export { UpdateFrameModal };
