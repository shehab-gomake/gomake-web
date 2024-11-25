import { GoMakeMenu } from "@/components";
import { Divider, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentCalculationConnectionId } from "@/store";
import { DeleteSettingsIcon, OsSettingsIcon, PrinterIcon, ProfitIcon, ProportiesIcon } from "@/icons";

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
  const currentSignalRConnectionId = useRecoilValue(currentCalculationConnectionId);

  const onClickProfit = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&signalRConnectionId=${currentSignalRConnectionId}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickProporties = () => {
    const uri = `/properties?actionId=${actionId}&actionName=${actionName}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickOsSettings = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&signalRConnectionId=${currentSignalRConnectionId}&isOutSource=true`;
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
      <MenuItem onClick={onClickProfit} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ProfitIcon />
        {t("products.profits.admin.title")}
      </MenuItem>
      <MenuItem onClick={onClickProporties} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ProportiesIcon />
        {t("products.profits.admin.proporties")}
      </MenuItem>
      <MenuItem onClick={onClickOsSettings} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <OsSettingsIcon />
        {t("products.profits.admin.OSSettings")}
      </MenuItem>
      {machineName && (
        <MenuItem onClick={onClickMachine} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <PrinterIcon />
          {t("products.offsetPrice.admin.machine")}
        </MenuItem>
      )}
      <Divider />
      <MenuItem style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <DeleteSettingsIcon />
        {t("navigationButtons.delete")}
      </MenuItem>
    </GoMakeMenu>
  );
};

export { SettingsMenu };
