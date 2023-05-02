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

import { ProfileFrameSizeMapping } from "./profile-frame-size-mapping";
import { materialProfileFrameState } from "../store/profile-frame";
import { useStyle } from "./style";

const AddNewProfileFrameModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialProfileFrameStateValue?.openAddNewProfileFrameModal}
        modalTitle={t("materials.profileFrames.admin.addNewProfileFrame")}
        onClose={materialProfileFrameStateValue?.onCloseAddNewProfileFrameModal}
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
                value={materialProfileFrameStateValue?.categoryName}
                onChange={(e: any) => {
                  materialProfileFrameStateValue?.setCategoryName(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.profileFrames.admin.profileFrameSizeSection")}
              </div>
              <Tooltip
                title={t("materials.profileFrames.admin.addProfileFrameize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialProfileFrameStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      width: "",
                      height: "",
                      length: "",
                      stock: "",
                      defaultPricePerMeter: "",
                      defaultPricePerUnit: "",
                    });
                    materialProfileFrameStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.profileFrames.admin.removeProfileFrameSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialProfileFrameStateValue?.items];
                    temp.pop();
                    materialProfileFrameStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialProfileFrameStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <ProfileFrameSizeMapping
                    key={`platSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialProfileFrameStateValue?.addNewProfileFrameSize}
            >
              {t("materials.profileFrames.admin.addNewProfileFrame")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewProfileFrameModal };
