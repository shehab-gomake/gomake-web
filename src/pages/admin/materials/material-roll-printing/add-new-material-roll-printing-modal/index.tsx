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

import { PlatSizeMapping } from "./plat-size-mapping";
import { materialPlatsState } from "../store/plat";
import { useStyle } from "./style";

const AddNewTubeModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <GoMakeModal
        openModal={materialPlatsStateValue?.openAddNewPlatModal}
        modalTitle={t(
          "materials.printingMaterials.admin.addNewMaterialRollPrinting"
        )}
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
                {t(
                  "materials.printingMaterials.admin.materialRollPrintingSizeSection"
                )}
              </div>
              <Tooltip
                title={t(
                  "materials.printingMaterials.admin.addNewMaterialRollPrintingSize"
                )}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPlatsStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      width: "",
                      height: "",
                      weightPerSquareMeter: "",
                      withPremier: false,
                      stock: "",
                      defaultPricePerSquareMeter: "",
                    });
                    materialPlatsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  "materials.printingMaterials.admin.removeMaterialRollPrintingSize"
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
              {t(
                "materials.printingMaterials.admin.addNewMaterialRollPrinting"
              )}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewTubeModal };
