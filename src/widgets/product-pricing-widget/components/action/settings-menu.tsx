import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const SettingsMenu = ({
  handleClose,
  open,
  anchorEl,
  actionId,
  actionName,
  currentProductItemValue,
  machineName,
  categoryId,
}) => {
  const { t } = useTranslation();
  const onClickProfit = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&draftId=${currentProductItemValue.id}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickProporties = () => {
    const uri = `/properties?actionId=${actionId}&actionName=${actionName}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickOsSettings = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&draftId=${currentProductItemValue.id}&isOutSource=true`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickMachine = () => {
    const uri = `/machines/category/${categoryId}`;
    window.open(uri, "_blank");
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
      <MenuItem onClick={onClickOsSettings}>
        {t("products.profits.admin.OSSettings")}
      </MenuItem>
      {machineName && (
        <MenuItem onClick={onClickMachine}>
          {/* {t("products.profits.admin.OSSettings")} */}
          machine
        </MenuItem>
      )}
    </GoMakeMenu>
  );
};

export { SettingsMenu };
