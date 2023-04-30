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

import { PlatSizeMapping } from "./profile-frame-size-mapping";
import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const AddNewPlatModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <GoMakeModal
        openModal={materialPlatsStateValue?.openAddNewPlatModal}
        modalTitle={t("materials.profileFrames.admin.addNewProfileFrame")}
        onClose={materialPlatsStateValue?.onCloseAddNewPlatModal}
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
                value={materialPlatsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialPlatsStateValue?.setCategoryName(e.target.value);
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
                    const temp = [...materialPlatsStateValue?.items];
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
                    materialPlatsStateValue?.setItems(temp);
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
                    const temp = [...materialPlatsStateValue?.items];
                    temp.pop();
                    materialPlatsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialPlatsStateValue?.items?.map((item: any, index: number) => {
              return (
                <PlatSizeMapping
                  key={`platSizeMapping_${index}`}
                  index={index}
                />
              );
            })}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialPlatsStateValue?.addNewPlatsSize}
            >
              {t("materials.profileFrames.admin.addNewProfileFrame")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewPlatModal };
