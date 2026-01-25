import { MenuItem } from "@mui/material";
import { AddPlusIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { EditMenuIcon } from "./icons/edit-menu";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const MoreMenuWidget = ({
  onCOpenEditModal,
  onOpenAddRuleModal,
  handleClose,
  anchorEl,
  open,
  selectedProperties,
  updateIsHiddenFromWorkFlow,
  updateIsHiddenFromCalculation,
  ToggleIsShowInOutSourceDetails
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem
        style={classes.menuItemContainer}
        onClick={() => {
          onCOpenEditModal();
          handleClose();
        }}
      >
        <EditMenuIcon color={classes.iconColor} />
        <div style={classes.menuTitleStyle}>{t("properties.editRules")}</div>
      </MenuItem>
      <MenuItem
        style={classes.menuItemContainer}
        onClick={() => {
          onOpenAddRuleModal();
          handleClose();
        }}
      >
        <AddPlusIcon />
        <div style={classes.menuTitleStyle}>{t("properties.addRule")}</div>
      </MenuItem>
      <MenuItem
        style={classes.menuItemContainer}
        onClick={() => {
          updateIsHiddenFromWorkFlow();
          handleClose();
        }}
      >

        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: classes.iconColor
        }} />
        <div style={classes.menuTitleStyle}>{selectedProperties?.isHiddenFromWorkFlow ? t("properties.showPropertyFromWorkFlow") : t("properties.hidePropertyFromWorkFlow")}</div>
      </MenuItem>

      <MenuItem
        style={classes.menuItemContainer}
        onClick={() => {
          updateIsHiddenFromCalculation();
          handleClose();
        }}
      >

        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: classes.iconColor
        }} />
        <div style={classes.menuTitleStyle}>{selectedProperties?.isHiddenFromCalculation ? t("properties.showPropertyFromCalculation") : t("properties.hidePropertyFromCalculation")}</div>
      </MenuItem>

      <MenuItem
        style={classes.menuItemContainer}
        onClick={() => {
          ToggleIsShowInOutSourceDetails();
          handleClose();
        }}
      >
        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: classes.iconColor
        }} />
        <div style={classes.menuTitleStyle}>{selectedProperties?.isShowInOutSourceDetails ? t("properties.hidePropertyFromPurchaseOrder") : t("properties.showPropertyFromPurchaseOrder")}</div>
      </MenuItem>
    </GoMakeMenu>
  );
};
export { MoreMenuWidget };
