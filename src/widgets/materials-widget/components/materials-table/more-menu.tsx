import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";
import { toggleMaterialTypeActiveApi } from "@/services/api-service/materials/materials-endpoints";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const MoreMenuWidget = ({
  handleClose,
  open,
  anchorEl,
  selectedMaterial,
  getAllMaterials
}) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const toggleMaterialTypeActive = async () => {
    const callBack = res => {
      if (res.success) {
        alertSuccessUpdate()
        getAllMaterials()
      } else {
        alertFaultUpdate()

      }
    }
    await toggleMaterialTypeActiveApi(callApi, callBack, {
      key: selectedMaterial?.materialTypeKey
    });
  };
  return (
    <>

      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            toggleMaterialTypeActive();
            handleClose();
          }}
        >
          {selectedMaterial?.isActive ? t("navigationButtons.deactivate") : t("navigationButtons.activate")}
        </MenuItem>
      </GoMakeMenu>
    </>

  );
};
export { MoreMenuWidget };
