import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Menu, MenuItem } from "@mui/material";

const SettingsMenuModal = ({
  anchorEl,
  open,
  handleClose,
  onOpenUpdatePricePerUnit,
  onOpenUpdatePricePerMeter,
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
        <MenuItem onClick={onOpenUpdatePricePerUnit}>
          {t("materials.sheetPaper.updatePricePerUnit")}
        </MenuItem>
        <MenuItem onClick={onOpenUpdatePricePerMeter}>
          {t("materials.sheetPaper.updatePricePerMeter")}
        </MenuItem>
        <MenuItem onClick={onOpenAddPercentToPrice}>
          {t("materials.sheetPaper.addPrecentToPriceMenu")}
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
