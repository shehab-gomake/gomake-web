import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface CancelBtnMenuProps {
  handleClose: () => void;
  open: boolean;
  anchorEl: null | HTMLElement;
  onClickOpenDeliveryTimeModal?: any | null;
  onClickOpenPriceModal?: any | null;
  onClickOpenIrrelevantModal?: any | null;
  onClickOpenModal?: (() => void) | null;
  menuWidth?: "default" | "small" | "large";
}

const CancelBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickOpenDeliveryTimeModal,
  onClickOpenPriceModal,
  onClickOpenIrrelevantModal,
  onClickOpenModal,
}: CancelBtnMenuProps) => {
  const { t } = useTranslation();
  const { primarySecondaryBlend } = useGomakeTheme();

  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
      sx={{
        "& .MuiPaper-root": {
          border: `1px solid ${primarySecondaryBlend(100)}`,
          borderRadius: "8px",
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onClickOpenIrrelevantModal();
          handleClose();
        }}
      >
        {t("sales.quote.irrelevant")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenPriceModal();
          handleClose();
        }}
      >
        {t("sales.quote.price")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenDeliveryTimeModal();
          handleClose();
        }}
      >
        {t("sales.quote.deliveryTime")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenModal();
          handleClose();
        }}
      >
        {t("sales.quote.other")}
      </MenuItem>
    </GoMakeMenu>
  );
};

export { CancelBtnMenu };
