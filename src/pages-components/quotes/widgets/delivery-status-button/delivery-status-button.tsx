import { MouseEvent } from "react";
import { MenuItem, Menu, Typography } from "@mui/material";
import { ChangeIcon } from "./utils/icons";
import { useStyle } from "./style";
import { useDeliveryStatusButton } from "./use-delivery-status";
import { ITaskCategoryLabelProps } from "./utils/interfaces";
import { UpdateDeliveryStatusModal } from "./delivery-status-modal/delivery-status-modal";
import { DocumentDeliveryStatuses } from "./delivery-status-modal/use-delivery-status-modal";
import { useClientContactsList } from "@/hooks/use-client-contacts";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";

const ClickableStatusButton = ({
  id,
  document,
  documentType,
  openModalOnClick = false,
  onClickOpenMoveOrderToReadyModal,
}: ITaskCategoryLabelProps) => {
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
    handleMenuClose,
    handleMenuClick,
    anchorChangeEl,

    onCloseDeleteModal,
    selectedItem,
    removeDocumentDeliveryItem,
    openDeleteModal,
  } = useDeliveryStatusButton();
  const { getClientContacts, clientContacts } = useClientContactsList();

  const dir = t("direction");
  const isRtl = dir === "rtl";
  const { classes } = useStyle({
    color: _renderDeliveryStatusColor(document?.deliveryStatus),
  });

  const handleChangeStatusClick = (event: MouseEvent<HTMLElement>) => {
    getDocumentDeliveryItems(documentType, document?.id);
    getClientContacts(document?.customerId);
    handleMenuClose();
  };

  return (
    <>
      <span
        onClick={openModalOnClick ? handleChangeStatusClick : handleMenuClick}
        style={classes.spanStyle}
      >
        {t(
          `sales.documentDeliveries.${
            DocumentDeliveryStatuses[document?.deliveryStatus]
          }`
        )}
      </span>
      {!openModalOnClick && (
        <Menu
          key={`Status-menu-${id}`}
          anchorEl={anchorChangeEl}
          open={Boolean(anchorChangeEl)}
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
      )}
      <UpdateDeliveryStatusModal
        openModal={openDeliveryModal}
        onCloseModal={onCloseDeliveryModal}
        document={document}
        documentItems={renderTableRows()}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
        clientContacts={clientContacts}
        documentType={documentType}
        documentId={document?.id}
        onClickOpenMoveOrderToReadyModal={onClickOpenMoveOrderToReadyModal}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        onClickDelete={() => removeDocumentDeliveryItem(selectedItem)}
      />
    </>
  );
};

export { ClickableStatusButton };
