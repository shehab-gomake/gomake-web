import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Menu, MenuItem } from "@mui/material";

const SettingsMenuModal = ({
  anchorEl,
  open,
  handleClose,
  onOpenUpdatePricePerRoll,
  onOpenUpdatePricePerSquareMeter,
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
        <MenuItem onClick={onOpenUpdatePricePerRoll}>
          {t("materials.inputs.updatePricePerRoll")}
        </MenuItem>
        <MenuItem onClick={onOpenUpdatePricePerSquareMeter}>
          {t("materials.inputs.updatePricePerSquareMeter")}
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
