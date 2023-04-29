import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddPlatSizeWeightsMapping } from "./add-plat-size-mapping";
import { SheetWeightsMapping } from "./plat-size-mapping";
import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const UpdatePlatModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);
  const selectedItem = materialPlatsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialPlatsStateValue?.openUpdateSheetModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Material Roll Printing`}
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
                {t("materials.plat.admin.platSizeSection")}
              </div>
              {!materialPlatsStateValue?.isAddNewSheetWights && (
                <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
                  <IconButton
                    onClick={() => {
                      materialPlatsStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          width: "",
                          height: "",
                          weightPerSquareMeter: "",
                          withPremier: false,
                          stock: "",
                          defaultPricePerSquareMeter: "",
                        },
                      ]);
                      materialPlatsStateValue?.setIsAddNewSheetWights(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialPlatsStateValue?.isAddNewSheetWights && (
              <AddPlatSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.materialRollPrintingSizes?.map(
              (item: any, index: number) => {
                return (
                  <SheetWeightsMapping
                    key={`platSizeMapping_${index}`}
                    index={index}
                    item={item}
                    selectedItem={selectedItem}
                  />
                );
              }
            )}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdatePlatModal };
