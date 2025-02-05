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
      <MenuItem
        style={clasess.menuItemContainer}
        onClick={() => {
          updateIsHiddenFromWorkFlow();
          handleClose();
        }}
      >

        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: "#8283BE"
        }} />
        <div style={clasess.menuTitleStyle}>{selectedProperties?.isHiddenFromWorkFlow ? t("properties.showPropertyFromWorkFlow") : t("properties.hidePropertyFromWorkFlow")}</div>
      </MenuItem>

      <MenuItem
        style={clasess.menuItemContainer}
        onClick={() => {
          updateIsHiddenFromCalculation();
          handleClose();
        }}
      >

        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: "#8283BE"
        }} />
        <div style={clasess.menuTitleStyle}>{selectedProperties?.isHiddenFromCalculation ? t("properties.showPropertyFromCalculation") : t("properties.hidePropertyFromCalculation")}</div>
      </MenuItem>

      <MenuItem
        style={clasess.menuItemContainer}
        onClick={() => {
          ToggleIsShowInOutSourceDetails();
          handleClose();
        }}
      >

        <VisibilityOutlinedIcon style={{
          width: "18px",
          height: "18px",
          color: "#8283BE"
        }} />
        <div style={clasess.menuTitleStyle}>{selectedProperties?.isShowInOutSourceDetails ? t("properties.showPropertyFromPurchaseOrder") : t("properties.hidePropertyFromPurchaseOrder")}</div>
      </MenuItem>
    </GoMakeMenu>
  );
};
export { MoreMenuWidget };
