import { MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeMenu } from "@/components";

const MoreMenuWidget = ({
  handleClose,
  open,
  anchorEl,
  selectedActionProfitRow,
  onClickOpenDeleteRowModal,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem 
        style={classes.menuItemStyle}
        onClick={() => {
          onClickOpenDeleteRowModal();
          handleClose();
        }}
      >
        {t("navigationButtons.delete")}
      </MenuItem>
    </GoMakeMenu>
  );
};
export { MoreMenuWidget };
