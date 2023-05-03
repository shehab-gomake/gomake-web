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

import { FrameSizeMapping } from "./frame-size-mapping";
import { materialFrameState } from "../store/frame";
import { useStyle } from "./style";

const AddNewFrameModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);

  return (
    <>
      <GoMakeModal
        openModal={materialFrameStateValue?.openAddNewFrameModal}
        modalTitle={t("materials.frames.admin.addNewFrame")}
        onClose={materialFrameStateValue?.onCloseAddNewFrameModal}
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
                value={materialFrameStateValue?.categoryName}
                onChange={(e: any) => {
                  materialFrameStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.frames.admin.frameSizeSection")}
              </div>
              <Tooltip title={t("materials.frames.admin.addFrameSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialFrameStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      color: "",
                      width: "",
                      height: "",
                      thickness: "",
                      weight: "",
                      stock: "",
                      defaultPrice: "",
                    });
                    materialFrameStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("materials.frames.admin.removeFrameSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialFrameStateValue?.items];
                    temp.pop();
                    materialFrameStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialFrameStateValue?.items?.map((item: any, index: number) => {
              return (
                <FrameSizeMapping
                  key={`platSizeMapping_${index}`}
                  index={index}
                />
              );
            })}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialFrameStateValue?.addNewFrameSize}
            >
              {t("materials.frames.admin.addNewFrame")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewFrameModal };
