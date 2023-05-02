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

import { TubeSizeMapping } from "./tube-size-mapping";
import { materialTubeState } from "../store/tube";
import { useStyle } from "./style";

const AddNewTubeModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);

  return (
    <>
      <GoMakeModal
        openModal={materialTubeStateValue?.openAddNewTubeModal}
        modalTitle={t("materials.tubes.admin.addNewTubes")}
        onClose={materialTubeStateValue?.onCloseAddNewTubeModal}
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
                value={materialTubeStateValue?.categoryName}
                onChange={(e: any) => {
                  materialTubeStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.tubes.admin.tubesSizeSection")}
              </div>
              <Tooltip title={t("materials.tubes.admin.addTubesSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialTubeStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      lenght: "",
                      diameter: "",
                      weight: "",
                      defaultPrice: "",
                    });
                    materialTubeStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("materials.tubes.admin.removeTubesSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialTubeStateValue?.items];
                    temp.pop();
                    materialTubeStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialTubeStateValue?.items?.map((item: any, index: number) => {
              return (
                <TubeSizeMapping
                  key={`platSizeMapping_${index}`}
                  index={index}
                />
              );
            })}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialTubeStateValue?.addNewTubeSize}
            >
              {t("materials.tubes.admin.addNewTubes")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewTubeModal };
