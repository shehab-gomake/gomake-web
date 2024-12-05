import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";

const MoreMenuWidget = ({
  handleClose,
  open,
  anchorEl,
  selectedMaterial
}) => {
  const { t } = useTranslation();
  console.log("selectedMaterial", selectedMaterial)
  return (
    <>

      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
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
