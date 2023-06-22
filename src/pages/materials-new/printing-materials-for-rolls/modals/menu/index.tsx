import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Menu, MenuItem } from "@mui/material";

const SettingsMenuModal = ({
  anchorEl,
  open,
  handleClose,
  onOpenUpdatePrice,
  onOpenAddPercentToPrice,
  updateToActive,
  updateToInActive,
  onOpenUpdateCurrency,
  onOpenUpdatepricePerSquareMeter,
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
        {/* //PricePerSquareMeter 8 */}
        <MenuItem onClick={onOpenUpdatepricePerSquareMeter}>
          {t("materials.sheetPaper.pricePerSquareMeter")}
        </MenuItem>
        <MenuItem onClick={updateToActive}>
          {t("materials.sheetPaper.changeToActiveMenu")}
        </MenuItem>
        <MenuItem onClick={updateToInActive}>
          {t("materials.sheetPaper.changeToInActiveMenu")}
        </MenuItem>
        <MenuItem onClick={onOpenUpdateCurrency}>
          {t("materials.sheetPaper.updateCurrency")}
        </MenuItem>
      </Menu>
    </>
  );
};
export { SettingsMenuModal };
