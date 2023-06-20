import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Menu, MenuItem } from "@mui/material";

const SettingsMenuModal = ({
  anchorEl,
  open,
  handleClose,
  onOpenUpdatePricePerTon,
  onOpenUpdateUnitPrice,
  onOpenAddPercentToPrice,
  updateToActive,
  updateToInActive,
  onOpenUpdateCurrency,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={onOpenUpdatePricePerTon}>
          Update Price per ton
        </MenuItem>
        <MenuItem onClick={onOpenUpdateUnitPrice}>Update unit price</MenuItem>
        <MenuItem onClick={onOpenAddPercentToPrice}>
          Add Precent to price
        </MenuItem>
        <MenuItem onClick={updateToActive}>Change to Active</MenuItem>
        <MenuItem onClick={updateToInActive}>Change to InActive</MenuItem>
        <MenuItem onClick={onOpenUpdateCurrency}>Update Currency</MenuItem>
      </Menu>
    </>
  );
};
export { SettingsMenuModal };
