import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddPlatSizeWeightsMapping } from "./add-frame-size-mapping";
import { PlatWeightsMapping } from "./frame-size-mapping";
import { materialPlatsState } from "../store/frame";
import { useStyle } from "./style";

const UpdatePlatModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);
  const selectedItem = materialPlatsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialPlatsStateValue?.openUpdatePlatModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Frame`}
        onClose={materialPlatsStateValue?.onCloseUpdateModal}
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
                {t("materials.frames.admin.frameSizeSection")}
              </div>
              {!materialPlatsStateValue?.isAddNewPlatWights && (
                <Tooltip title={t("materials.plat.admin.addPlatSize")}>
                  <IconButton
                    onClick={() => {
                      materialPlatsStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          color: "",
                          width: "",
                          height: "",
                          thickness: "",
                          weight: "",
                          stock: "",
                          defaultPrice: "",
                        },
                      ]);
                      materialPlatsStateValue?.setIsAddNewPlatWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialPlatsStateValue?.isAddNewPlatWights && (
              <AddPlatSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.frameSizes?.map((item: any, index: number) => {
              return (
                <PlatWeightsMapping
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
export { UpdatePlatModal };
