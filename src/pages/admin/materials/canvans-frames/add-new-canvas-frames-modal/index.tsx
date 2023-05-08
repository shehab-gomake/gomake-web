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

import { CanvasFrameSizeMapping } from "./canvas-frames-size-mapping";
import { materialCanvasFramesState } from "../store/canvas-frames";
import { useStyle } from "./style";

const AddNewCanvasFramesModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialCanvasFramesStateValue?.openAddNewPCanvasFrameModal}
        modalTitle={t("materials.canvasFrames.admin.addNewCanvasFrame")}
        onClose={materialCanvasFramesStateValue?.onCloseAddNewCanvasFrameModal}
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
                value={materialCanvasFramesStateValue?.categoryName}
                onChange={(e: any) => {
                  materialCanvasFramesStateValue?.setCategoryName(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.canvasFrames.admin.canvasFrameSizeSection")}
              </div>
              <Tooltip
                title={t("materials.canvasFrames.admin.addCanvasFrameSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialCanvasFramesStateValue?.items];
                    temp.push({
                      code: "",
                      defaultPrice: "",
                      height: "",
                      name: "",
                      stock: "",
                      thickness: "",
                      weight: "",
                      width: "",
                    });
                    materialCanvasFramesStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.canvasFrames.admin.removeCanvasFrameSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialCanvasFramesStateValue?.items];
                    temp.pop();
                    materialCanvasFramesStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialCanvasFramesStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <CanvasFrameSizeMapping
                    key={`CanvasFrameSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialCanvasFramesStateValue?.addNewCanvasFrameSize}
            >
              {t("materials.canvasFrames.admin.addNewCanvasFrame")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewCanvasFramesModal };
