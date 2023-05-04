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

import { PlatSizeMapping } from "./packin-drum-size-mapping";
import { materialPlatsState } from "../store/packin-drum";
import { useStyle } from "./style";

const AddNewPlatModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <GoMakeModal
        openModal={materialPlatsStateValue?.openAddNewPlatModal}
        modalTitle={t("materials.packinDrums.admin.addNewPackinDrum")}
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
                {t("materials.packinDrums.admin.packinDrumSizeSection")}
              </div>
              <Tooltip
                title={t("materials.packinDrums.admin.addPackinDrumSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPlatsStateValue?.items];
                    temp.push({
                      code: "",
                      material: "",
                      size: "",
                      sizeName: "",
                      drumRingNumber: "",
                      weight: "",
                      defaultPricePerDrum: "",
                    });
                    materialPlatsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.packinDrums.admin.removePackinDrumSize")}
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
              {t("materials.packinDrums.admin.addNewPackinDrum")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewPlatModal };
