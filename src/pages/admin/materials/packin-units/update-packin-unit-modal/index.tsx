import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddPackinUnitSizeMapping } from "./add-packin-unit-size-mapping";
import { PackinUnitSizeMapping } from "./packin-unit-size-mapping";
import { materialPackinUnitsState } from "../store/packin-units";
import { useStyle } from "./style";

const UpdatePackinUnit = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );
  const selectedItem = materialPackinUnitsStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialPackinUnitsStateValue?.openUpdatePlatModal}
        modalTitle={`${t("materials.buttons.edit")} ${
          selectedItem?.categoryName
        } ${t("materials.packinUnits.admin.packinUnit")}`}
        onClose={materialPackinUnitsStateValue?.onCloseUpdateModal}
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
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.packinUnits.admin.packinUnitSizeSection")}
              </div>
              {!materialPackinUnitsStateValue?.isAddNewPackinUnitSize && (
                <Tooltip
                  title={t("materials.packinUnits.admin.addNewPackinUnitSize")}
                >
                  <IconButton
                    onClick={() => {
                      materialPackinUnitsStateValue.setItems([
                        {
                          code: "",
                          material: "",
                          size: "",
                          sizeName: "",
                          width: "",
                          weight: "",
                          defaultPricePerUnit: "",
                        },
                      ]);
                      materialPackinUnitsStateValue?.setIsAddNewPackinUnitSize(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialPackinUnitsStateValue?.isAddNewPackinUnitSize && (
              <AddPackinUnitSizeMapping index={0} selectedItem={selectedItem} />
            )}
            {selectedItem?.packinUnitSizes?.map((item: any, index: number) => {
              return (
                <PackinUnitSizeMapping
                  key={`packinUnitSizeMapping_${index}`}
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
export { UpdatePackinUnit };
