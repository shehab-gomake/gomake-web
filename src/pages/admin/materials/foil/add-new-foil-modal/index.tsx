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

import { FoilSizeMapping } from "./foil-size-mapping";
import { materialFoilState } from "../store/foil";
import { useStyle } from "./style";

const AddNewFoilModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);

  return (
    <>
      <GoMakeModal
        openModal={materialFoilStateValue?.openAddNewFoilModal}
        modalTitle={t("materials.foils.admin.addNewFoil")}
        onClose={materialFoilStateValue?.onCloseAddNewFoilModal}
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
                value={materialFoilStateValue?.categoryName}
                onChange={(e: any) => {
                  materialFoilStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.foils.admin.foilSizeSection")}
              </div>
              <Tooltip title={t("materials.foils.admin.addFoilSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialFoilStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      width: "",
                      height: "",
                      defaultPrice: "",
                    });
                    materialFoilStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("materials.foils.admin.removeFoilSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialFoilStateValue?.items];
                    temp.pop();
                    materialFoilStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialFoilStateValue?.items?.map((item: any, index: number) => {
              return (
                <FoilSizeMapping
                  key={`platSizeMapping_${index}`}
                  index={index}
                />
              );
            })}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialFoilStateValue?.addNewFoilSize}
            >
              {t("materials.foils.admin.addNewFoil")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewFoilModal };
