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

import { PackinUnitSizeMapping } from "./packin-unit-size-mapping";
import { materialPackinUnitsState } from "../store/packin-units";
import { useStyle } from "./style";

const AddNewPackinUnitsModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialPackinUnitsStateValue?.openAddNewPackinUnitModal}
        modalTitle={t("materials.packinUnits.admin.addNewPackinUnit")}
        onClose={materialPackinUnitsStateValue?.onCloseAddNewPackinUnitsModal}
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
                value={materialPackinUnitsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialPackinUnitsStateValue?.setCategoryName(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.packinUnits.admin.packinUnitSizeSection")}
              </div>
              <Tooltip
                title={t("materials.packinUnits.admin.addNewPackinUnitSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPackinUnitsStateValue?.items];
                    temp.push({
                      code: "",
                      material: "",
                      size: "",
                      sizeName: "",
                      width: "",
                      weight: "",
                      defaultPricePerUnit: "",
                    });
                    materialPackinUnitsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.packinUnits.admin.removeLastPackinUnit")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPackinUnitsStateValue?.items];
                    temp.pop();
                    materialPackinUnitsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialPackinUnitsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <PackinUnitSizeMapping
                    key={`packinUnitSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialPackinUnitsStateValue?.addNewPackinUnitSize}
            >
              {t("materials.packinUnits.admin.addNewPackinUnit")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewPackinUnitsModal };
