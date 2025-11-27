import React, { useState, useMemo, useCallback } from "react";
import { MenuItem, Menu, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { FONT_FAMILY } from "@/utils/font-family";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { TickIcon } from "@/icons";
import { LockIcon as CustomLockIcon } from "./icons/lock";

interface CloseOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface CloseDocumentSubmenuProps {
  documentType: DOCUMENT_TYPE;
  document: any;
  onCloseDocument: (id: string) => void;
  onCloseAsDeliveryNote?: () => void;
  onCloseAsProformaInvoice?: () => void;
  onCloseAsInvoice?: () => void;
  onCreateDeliveryNoteRefund?: () => void;
  onCreateInvoiceRefund?: () => void;
  onCreatePurchaseInvoiceRefund?: () => void;
  onClickOpenCloseOrderNotesModal?: (
    document: any,
    actionType: string,
    callback: () => void
  ) => void;
  menuItemStyle?: any;
  rowTextStyle?: any;
  onCloseParentMenu?: () => void;
}

export const CloseDocumentSubmenu: React.FC<CloseDocumentSubmenuProps> = ({
  documentType,
  document,
  onCloseDocument,
  onCloseAsDeliveryNote,
  onCloseAsProformaInvoice,
  onCloseAsInvoice,
  onCreateDeliveryNoteRefund,
  onCreateInvoiceRefund,
  onCreatePurchaseInvoiceRefund,
  onClickOpenCloseOrderNotesModal,
  menuItemStyle,
  rowTextStyle,
  onCloseParentMenu,
}) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const isRTL = direction === "rtl";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback((event?: React.MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  }, []);

  const handleMenuItemClick = useCallback(
    (callback: () => void) => (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(null);
      onCloseParentMenu?.();
      setTimeout(() => {
        callback();
      }, 0);
    },
    [onCloseParentMenu]
  );

  // Memoize close options to prevent recreating callbacks on every render
  const closeOptions = useMemo((): CloseOption[] => {
    const options: CloseOption[] = [];

    switch (documentType) {
      case DOCUMENT_TYPE.order:
        // Close order
        options.push({
          label: t("sales.quote.close"),
          onClick: () => {
            if (
              document?.closeOrderNotes?.trim() &&
              onClickOpenCloseOrderNotesModal
            ) {
              onClickOpenCloseOrderNotesModal(document, "closeManually", () =>
                onCloseDocument(document)
              );
            } else {
              onCloseDocument(document);
            }
          },
        });

        // Close as Delivery Note
        if (onCloseAsDeliveryNote) {
          options.push({
            label: t("sales.quote.closeAsDeliveryNote"),
            onClick: onCloseAsDeliveryNote,
          });
        }

        // Close as Proforma Invoice
        if (onCloseAsProformaInvoice) {
          options.push({
            label: t("sales.quote.closeAsProformaInvoice"),
            onClick: onCloseAsProformaInvoice,
          });
        }

        // Close as Invoice
        if (onCloseAsInvoice) {
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: onCloseAsInvoice,
          });
        }
        break;

      case DOCUMENT_TYPE.deliveryNote:
        // Close delivery note
        options.push({
          label: t("sales.quote.close"),
          onClick: () => onCloseDocument(document),
        });

        // Close as Proforma Invoice
        if (onCloseAsProformaInvoice) {
          options.push({
            label: t("sales.quote.closeAsProformaInvoice"),
            onClick: onCloseAsProformaInvoice,
          });
        }

        // Close as Invoice
        if (onCloseAsInvoice) {
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: onCloseAsInvoice,
          });
        }

        // Create Delivery Note Refund
        if (onCreateDeliveryNoteRefund) {
          options.push({
            label: t("sales.quote.createDeliveryNoteRefund"),
            onClick: onCreateDeliveryNoteRefund,
          });
        }
        break;

      case DOCUMENT_TYPE.proformaInvoice:
        // Close proforma invoice
        options.push({
          label: t("sales.quote.close"),
          onClick: () => onCloseDocument(document),
        });

        // Close as Invoice
        if (onCloseAsInvoice) {
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: onCloseAsInvoice,
          });
        }
        break;

      case DOCUMENT_TYPE.invoice:
        // Close invoice
        options.push({
          label: t("sales.quote.close"),
          onClick: () => onCloseDocument(document),
        });

        // Create Invoice Refund
        if (onCreateInvoiceRefund) {
          options.push({
            label: t("sales.quote.createInvoiceRefund"),
            onClick: onCreateInvoiceRefund,
          });
        }
        break;

      case DOCUMENT_TYPE.purchaseOrder:
        // Close purchase order
        options.push({
          label: t("sales.quote.close"),
          onClick: () => onCloseDocument(document),
        });
        break;

      case DOCUMENT_TYPE.purchaseInvoice:
        // Create Purchase Invoice Refund
        if (onCreatePurchaseInvoiceRefund) {
          options.push({
            label: t("sales.quote.closeAsPurchaseInvoiceRefund"),
            onClick: onCreatePurchaseInvoiceRefund,
          });
        }
        break;

      default:
        // For other document types, just show close option
        options.push({
          label: t("sales.quote.close"),
          onClick: () => onCloseDocument(document),
        });
        break;
    }

    return options;
  }, [
    documentType,
    document,
    t,
    onCloseDocument,
    onCloseAsDeliveryNote,
    onCloseAsProformaInvoice,
    onCloseAsInvoice,
    onCreateDeliveryNoteRefund,
    onCreateInvoiceRefund,
    onCreatePurchaseInvoiceRefund,
    onClickOpenCloseOrderNotesModal,
  ]);

  // Don't render if no options available
  if (closeOptions.length === 0) {
    return null;
  }

  // If only one option, render it directly without submenu
  if (closeOptions.length === 1) {
    return (
      <MenuItem
        style={menuItemStyle}
        onClick={handleMenuItemClick(closeOptions[0].onClick)}
      >
        <CustomLockIcon color="#8283BE" />
        <div style={rowTextStyle}>{closeOptions[0].label}</div>
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem
        style={menuItemStyle}
        onClick={handleClick}
        onMouseEnter={handleClick}
      >
        <CustomLockIcon color="#8283BE" />
        <div style={rowTextStyle}>{t("sales.quote.closeDocument")}</div>
        {isRTL ? (
          <ChevronLeftIcon sx={{ mr: "auto", fontSize: 20 }} />
        ) : (
          <ChevronRightIcon sx={{ ml: "auto", fontSize: 20 }} />
        )}
      </MenuItem>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: isRTL ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRTL ? "right" : "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            border: "1px solid #cbcbe4",
            borderRadius: "8px",
            minWidth: 220,
          },
        }}
        MenuListProps={{
          onMouseLeave: handleClose,
        }}
      >
        {closeOptions.map((option, index) => {
          const handleClick = handleMenuItemClick(option.onClick);
          return (
            <MenuItem key={`${option.label}-${index}`} onClick={handleClick}>
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: isRTL ? 0 : 0.5,
                  ml: isRTL ? 0.5 : 0,
                }}
              >
                {option.icon || <TickIcon color="#8283BE" />}
              </ListItemIcon>
              <ListItemText
                primary={option.label}
                primaryTypographyProps={{
                  sx: {
                    ...FONT_FAMILY.Lexend(400, 14),
                    color: "#28293D",
                  },
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
