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
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem
        style={clasess.menuItemStyle}
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
