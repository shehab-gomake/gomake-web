import { MenuItem } from "@mui/material";
import { AddPlusIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { EditMenuIcon } from "./icons/edit-menu";

const MoreMenuWidget = ({
  onCOpenEditModal,
  onOpenAddRuleModal,
  handleClose,
  anchorEl,
  open,
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem
        style={clasess.menuItemContainer}
        onClick={() => {
          onCOpenEditModal();
          handleClose();
        }}
      >
        <EditMenuIcon />
        <div style={clasess.menuTitleStyle}>{t("properties.editRules")}</div>
      </MenuItem>
      <MenuItem
        style={clasess.menuItemContainer}
        onClick={() => {
          onOpenAddRuleModal();
          handleClose();
        }}
      >
        <AddPlusIcon />
        <div style={clasess.menuTitleStyle}>{t("properties.addRule")}</div>
      </MenuItem>
    </GoMakeMenu>
  );
};
export { MoreMenuWidget };
