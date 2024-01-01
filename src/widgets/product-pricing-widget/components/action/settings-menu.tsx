import { GoMakeMenu } from "@/components";
import { useGomakeRouter } from "@/hooks";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const SettingsMenu = ({
  handleClose,
  open,
  anchorEl,
  actionId,
  actionName,
  currentProductItemValue,
}) => {
  const { t } = useTranslation();
  const onClickProfit = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&draftId=${currentProductItemValue.id}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickProporties = () => {
    handleClose();
  };
  return (
    <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
      <MenuItem onClick={onClickProfit}>
        {t("products.profits.admin.title")}
      </MenuItem>
      <MenuItem onClick={onClickProporties}>
        {t("products.profits.admin.proporties")}
      </MenuItem>
      <MenuItem onClick={onClickProporties}>
        {t("products.profits.admin.OSSettings")}
      </MenuItem>
    </GoMakeMenu>
  );
};

export { SettingsMenu };
