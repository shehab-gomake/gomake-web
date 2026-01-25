import { Divider, MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";

const PricingTableMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickOpenAddNewRuleModal,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem
        style={classes.menuItemStyle}
        onClick={() => {
          onClickOpenAddNewRuleModal();
          handleClose();
        }}
      >
        {t("products.profits.exceptions.addNewRule")}
      </MenuItem>
      <Divider style={classes.dividerStyle} />
      <MenuItem style={classes.menuItemStyle} onClick={handleClose}>
        {t("products.profits.exceptions.reorder")}
      </MenuItem>
    </GoMakeMenu>
  );
};
export { PricingTableMenu };
