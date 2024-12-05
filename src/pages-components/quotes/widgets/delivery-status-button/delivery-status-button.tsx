import { useState, MouseEvent } from "react";
import { MenuItem, Menu, Typography } from "@mui/material";
import { ChangeIcon } from "./icons";
import { useStyle } from "./style";
import { useDeliveryStatusButton } from "./use-delivery-status";

import { ITaskCategoryLabelProps } from "./interfaces";
import { UpdateDeliveryStatusModal } from "./delivery-status-modal/delivery-status-modal";

const ClickableStatusButton = ({
  label = "Delivered",
  delStatusColor = "#099250",
  id,
  documentItem,
}: ITaskCategoryLabelProps) => {
  const { t, openDeliveryModal, onOpenDeliveryModal, onCloseDeliveryModal } =
    useDeliveryStatusButton();
  const dir = t("direction");
  const isRtl = dir === "rtl";
  const { classes } = useStyle({ color: delStatusColor });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatusClick = (event: MouseEvent<HTMLElement>) => {
    onOpenDeliveryModal();
    handleMenuClose();
  };

  return (
    <>
      <span onClick={handleMenuClick} style={classes.spanStyle}>
        {label}
      </span>
      <Menu
        key={`Status-menu-${id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRtl ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRtl ? "right" : "left",
        }}
        PaperProps={{
          sx: classes.menuPaperStyle,
        }}
      >
        <MenuItem
          style={classes.menuRowStyle}
          onClick={handleChangeStatusClick}
        >
          <ChangeIcon />
          <Typography style={classes.menuText}>{t("Change status")}</Typography>
        </MenuItem>
      </Menu>
      <UpdateDeliveryStatusModal
        openModal={openDeliveryModal}
        onCloseModal={onCloseDeliveryModal}
        delStatusColor={delStatusColor}
        documentItem={documentItem}
      />
    </>
  );
};

export { ClickableStatusButton };
