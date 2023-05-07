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

import { PackingVolumnsMapping } from "./packing-volumn-mapping";
import { materialPackingsState } from "../store/packings";
import { useStyle } from "./style";

const AddNewPackingsModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);

  return (
    <>
      <GoMakeModal
        openModal={materialPackingsStateValue?.openAddNewPackingModal}
        modalTitle={t("materials.packings.admin.addNewPacking")}
        onClose={materialPackingsStateValue?.onCloseAddNewPackingsModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.packings.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.packings.admin.categoryName")}
                style={clasess.textInputStyle}
                value={materialPackingsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialPackingsStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.packings.admin.packingsVolumnSection")}
              </div>
              <Tooltip
                title={t("materials.packings.admin.addNewPackingVolumn")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPackingsStateValue?.items];
                    temp.push({
                      code: "",
                      width: "",
                      height: "",
                      length: "",
                      weight: "",
                      defaultPricePerUnit: "",
                    });
                    materialPackingsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.packings.admin.removeLastPackingVolumn")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialPackingsStateValue?.items];
                    temp.pop();
                    materialPackingsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialPackingsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <PackingVolumnsMapping
                    key={`packingVolumnsMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialPackingsStateValue?.addNewPacking}
            >
              {t("materials.packings.admin.addNewPacking")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewPackingsModal };
