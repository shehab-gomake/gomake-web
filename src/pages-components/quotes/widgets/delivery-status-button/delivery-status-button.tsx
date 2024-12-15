import { useState, MouseEvent } from "react";
import { MenuItem, Menu, Typography } from "@mui/material";
import { ChangeIcon } from "./icons";
import { useStyle } from "./style";
import { useDeliveryStatusButton } from "./use-delivery-status";
import { ITaskCategoryLabelProps } from "./interfaces";
import { UpdateDeliveryStatusModal } from "./delivery-status-modal/delivery-status-modal";
import { DocumentDeliveryStatuses } from "./delivery-status-modal/use-delivery-status-modal";

//!here
const ClickableStatusButton = ({ id, document }: ITaskCategoryLabelProps) => {
  const {
    t,
    openDeliveryModal,
    onCloseDeliveryModal,
    getDocumentDeliveryItems,
    _renderDeliveryStatusColor,
    renderTableRows,
    editableQuantities,
    setEditableQuantities,
    setDocumentItems,
  } = useDeliveryStatusButton();
  const dir = t("direction");
  const isRtl = dir === "rtl";
  const { classes } = useStyle({
    color: _renderDeliveryStatusColor(document?.deliveryStatus),
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeStatusClick = (event: MouseEvent<HTMLElement>) => {
    getDocumentDeliveryItems(document?.documentType, document?.id);
    handleMenuClose();
  };

  return (
    <>
      <span onClick={handleMenuClick} style={classes.spanStyle}>
        {t(
          `sales.documentDeliveries.${
            DocumentDeliveryStatuses[document?.deliveryStatus]
          }`
        )}
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
          <Typography style={classes.menuText}>
            {t("sales.documentDeliveries.changeStatus")}
          </Typography>
        </MenuItem>
      </Menu>
      <UpdateDeliveryStatusModal
        openModal={openDeliveryModal}
        onCloseModal={onCloseDeliveryModal}
        document={document}
        documentItems={renderTableRows()}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
      />
    </>
  );
};

export { ClickableStatusButton };
