import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddFoilSizeWeightsMapping } from "./add-foil-size-mapping";
import { FoilWeightsMapping } from "./foil-size-mapping";
import { materialFoilState } from "../store/foil";
import { useStyle } from "./style";

const UpdateFoilModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);
  const selectedItem = materialFoilStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialFoilStateValue?.openUpdateFoilModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Foil`}
        onClose={materialFoilStateValue?.onCloseUpdateModal}
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
                {t("materials.foils.admin.foilSizeSection")}
              </div>
              {!materialFoilStateValue?.isAddNewFoilWights && (
                <Tooltip title={t("materials.foils.admin.addFoilSize")}>
                  <IconButton
                    onClick={() => {
                      materialFoilStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          thickness: "",
                          width: "",
                          height: "",
                          weightPerSquareMeter: "",
                          defaultPricePerSquareMeter: "",
                          defaultPricePerRoll: "",
                        },
                      ]);
                      materialFoilStateValue?.setIsAddNewFoilWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialFoilStateValue?.isAddNewFoilWights && (
              <AddFoilSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.foilSizes?.map((item: any, index: number) => {
              return (
                <FoilWeightsMapping
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
export { UpdateFoilModal };
