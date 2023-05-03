import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddCanvasFrameSizeMapping } from "./add-canvas-frame-size-mapping";
import { CanvasFrameWeightsMapping } from "./canvas-frame-size-mapping";
import { materialCanvasFramesState } from "../store/canvas-frames";
import { useStyle } from "./style";

const UpdatePlatModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );
  const selectedItem = materialCanvasFramesStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialCanvasFramesStateValue?.openUpdatePlatModal}
        modalTitle={`Edit ${selectedItem?.categoryName} canvas frame`}
        onClose={materialCanvasFramesStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.canvasFrames.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.canvasFrames.admin.categoryName")}
                style={clasess.textInputStyle}
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.canvasFrames.admin.canvasFrameSizeSection")}
              </div>
              {!materialCanvasFramesStateValue?.isAddNewCanvasFrameWights && (
                <Tooltip
                  title={t("materials.canvasFrames.admin.addCanvasFrameSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialCanvasFramesStateValue.setItems([
                        {
                          code: "",
                          defaultPrice: "",
                          height: "",
                          name: "",
                          stock: "",
                          thickness: "",
                          weight: "",
                          width: "",
                        },
                      ]);
                      materialCanvasFramesStateValue?.setIsAddNewCanvasFrameWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialCanvasFramesStateValue?.isAddNewCanvasFrameWights && (
              <AddCanvasFrameSizeMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.canvasFrameSizes?.map((item: any, index: number) => {
              return (
                <CanvasFrameWeightsMapping
                  key={`CanvasFrameWeightsMapping_${index}`}
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
export { UpdatePlatModal };
