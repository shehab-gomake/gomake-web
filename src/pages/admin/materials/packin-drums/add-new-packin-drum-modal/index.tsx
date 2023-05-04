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

import { PackinDrumSizeMapping } from "./packin-drum-size-mapping";
import { materialPackinDrumState } from "../store/packin-drum";
import { useStyle } from "./style";

const AddNewPackinDrumModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinDrumStateValue = useRecoilValue<any>(
    materialPackinDrumState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialPackinDrumStateValue?.openAddNewPackinDrumModal}
        modalTitle={t("materials.packinDrums.admin.addNewPackinDrum")}
        onClose={materialPackinDrumStateValue?.onCloseAddNewPackinDrumModal}
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
                value={materialPackinDrumStateValue?.categoryName}
                onChange={(e: any) => {
                  materialPackinDrumStateValue?.setCategoryName(e.target.value);
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
                    const temp = [...materialPackinDrumStateValue?.items];
                    temp.push({
                      code: "",
                      material: "",
                      size: "",
                      sizeName: "",
                      drumRingNumber: "",
                      weight: "",
                      defaultPricePerDrum: "",
                    });
                    materialPackinDrumStateValue?.setItems(temp);
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
                    const temp = [...materialPackinDrumStateValue?.items];
                    temp.pop();
                    materialPackinDrumStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialPackinDrumStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <PackinDrumSizeMapping
                    key={`platSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialPackinDrumStateValue?.addNewPackinDrumSize}
            >
              {t("materials.packinDrums.admin.addNewPackinDrum")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewPackinDrumModal };
