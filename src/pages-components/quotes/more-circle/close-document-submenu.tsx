import React, { useState, useMemo, useCallback } from "react";
import { MenuItem, Menu, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { FONT_FAMILY } from "@/utils/font-family";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { TickIcon } from "@/icons";
import Link from "next/link";

interface CloseOption {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  isLink?: boolean;
  href?: string;
  disabled?: boolean;
}

interface CloseDocumentSubmenuProps {
  documentType: DOCUMENT_TYPE;
  document: any;
  onCloseDocument?: (id: string) => void;
  onCloseAsDeliveryNote?: () => void;
  onCloseAsProformaInvoice?: () => void;
  onCloseAsInvoice?: () => void;
  onCloseAsPurchaseInvoice?: () => void;
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
  onCloseAsPurchaseInvoice,
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
    (callback: () => void, isLink?: boolean) => (event: React.MouseEvent) => {
      // Always close menus first
      setAnchorEl(null);
      onCloseParentMenu?.();

      // For links, let the Link component handle navigation
      // The Link will automatically handle right-click and middle-click for new tabs
      if (isLink) {
        // Don't prevent default or stop propagation - let Link handle it naturally
        // Don't execute callback - Link handles navigation
        return;
      }

      // For non-links, prevent default and execute callback
      event.stopPropagation();
      event.preventDefault();
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
        const isOrderLocked = document?.isLocked === true;
        // Close order
        if (onCloseDocument && !isOrderLocked) {
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
        }

        // Close as Delivery Note
        if (onCloseAsDeliveryNote) {
          const shouldBeLink =
            document?.productionStatus && !document?.closeOrderNotes?.trim();
          options.push({
            label: t("sales.quote.closeAsDeliveryNote"),
            onClick: isOrderLocked ? undefined : onCloseAsDeliveryNote,
            disabled: isOrderLocked,
            isLink: shouldBeLink && !isOrderLocked,
            href: shouldBeLink && !isOrderLocked
              ? `/deliveryNote?isNewCreation=true&orderId=${document?.id}`
              : undefined,
          });
        }

        // Close as Proforma Invoice
        if (onCloseAsProformaInvoice) {
          const shouldBeLink =
            document?.productionStatus && !document?.closeOrderNotes?.trim();
          options.push({
            label: t("sales.quote.closeAsProformaInvoice"),
            onClick: isOrderLocked ? undefined : onCloseAsProformaInvoice,
            disabled: isOrderLocked,
            isLink: shouldBeLink && !isOrderLocked,
            href: shouldBeLink && !isOrderLocked
              ? `/proformaInvoice?isNewCreation=true&orderId=${document?.id}`
              : undefined,
          });
        }

        // Close as Invoice
        if (onCloseAsInvoice) {
          const shouldBeLink =
            document?.productionStatus && !document?.closeOrderNotes?.trim();
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: isOrderLocked ? undefined : onCloseAsInvoice,
            disabled: isOrderLocked,
            isLink: shouldBeLink && !isOrderLocked,
            href: shouldBeLink && !isOrderLocked
              ? `/invoice?isNewCreation=true&orderId=${document?.id}`
              : undefined,
          });
        }
        break;

      case DOCUMENT_TYPE.deliveryNote:
        // Close delivery note
        if (onCloseDocument) {
          options.push({
            label: t("sales.quote.close"),
            onClick: () => onCloseDocument(document),
          });
        }

        // Close as Proforma Invoice
        if (onCloseAsProformaInvoice) {
          options.push({
            label: t("sales.quote.closeAsProformaInvoice"),
            onClick: onCloseAsProformaInvoice,
            isLink: true,
            href: `/proformaInvoice?isNewCreation=true&deliveryNoteId=${document?.id}`,
          });
        }

        // Close as Invoice
        // Always navigates from delivery note, so always a link
        if (onCloseAsInvoice) {
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: onCloseAsInvoice,
            isLink: true,
            href: `/invoice?isNewCreation=true&deliveryNoteId=${document?.id}`,
          });
        }

        // Create Delivery Note Refund
        // Always navigates, so always a link
        if (onCreateDeliveryNoteRefund) {
          options.push({
            label: t("sales.quote.createDeliveryNoteRefund"),
            onClick: onCreateDeliveryNoteRefund,
            isLink: true,
            href: `/deliveryNoteRefund?isNewCreation=true&documentId=${document?.id}`,
          });
        }
        break;

      case DOCUMENT_TYPE.proformaInvoice:
        // Close proforma invoice
        if (onCloseDocument) {
          options.push({
            label: t("sales.quote.close"),
            onClick: () => onCloseDocument(document),
          });
        }

        // Close as Invoice
        // Always navigates from proforma invoice, so always a link
        if (onCloseAsInvoice) {
          options.push({
            label: t("sales.quote.closeAsInvoice"),
            onClick: onCloseAsInvoice,
            isLink: true,
            href: `/invoice?isNewCreation=true&proformaInvoiceId=${document?.id}`,
          });
        }
        break;

      case DOCUMENT_TYPE.invoice:
        // Close invoice
        if (onCloseDocument) {
          options.push({
            label: t("sales.quote.close"),
            onClick: () => onCloseDocument(document),
          });
        }

        // Create Invoice Refund
        // Always navigates, so always a link
        if (onCreateInvoiceRefund) {
          options.push({
            label: t("sales.quote.createInvoiceRefund"),
            onClick: onCreateInvoiceRefund,
            isLink: true,
            href: `/invoiceRefund?isNewCreation=true&documentId=${document?.id}`,
          });
        }
        break;

      case DOCUMENT_TYPE.purchaseOrder:
        // Close purchase order
        if (onCloseDocument) {
          options.push({
            label: t("sales.quote.close"),
            onClick: () => onCloseDocument(document),
          });
        }

        // Close as Purchase Invoice
        // Always navigates from purchase order, so always a link
        if (onCloseAsPurchaseInvoice) {
          options.push({
            label: t("sales.quote.closeAsPurchaseInvoice"),
            onClick: onCloseAsPurchaseInvoice,
            isLink: true,
            href: `/purchaseInvoice?isNewCreation=true&orderId=${document?.id}`,
          });
        }
        break;

      case DOCUMENT_TYPE.purchaseInvoice:
        // Create Purchase Invoice Refund
        if (onCreatePurchaseInvoiceRefund) {
          options.push({
            label: t("sales.quote.closeAsPurchaseInvoiceRefund"),
            onClick: onCreatePurchaseInvoiceRefund,
            isLink: true,
            href: `/purchaseInvoiceRefund?isNewCreation=true&documentId=${document?.id}`,
          });
        }
        break;

      default:
        // For other document types, show close option
        if (onCloseDocument) {
          options.push({
            label: t("sales.quote.close"),
            onClick: () => onCloseDocument(document),
          });
        }
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
    onCloseAsPurchaseInvoice,
    onCreateDeliveryNoteRefund,
    onCreateInvoiceRefund,
    onCreatePurchaseInvoiceRefund,
    onClickOpenCloseOrderNotesModal,
    onCloseDocument,
  ]);

  // Don't render if no options available
  if (closeOptions.length === 0) {
    return null;
  }

  // If only one option, render it directly without submenu
  if (closeOptions.length === 1) {
    const option = closeOptions[0];
    return (
      <MenuItem
        style={menuItemStyle}
        disabled={option.disabled}
        onClick={
          option.disabled || option.isLink
            ? undefined
            : handleMenuItemClick(option.onClick, option.isLink)
        }
      >
        {option?.isLink && !option.disabled ? (
          <Link
            href={option.href || "#"}
            rel="noopener noreferrer"
            onClick={(e) => {
              setAnchorEl(null);
              onCloseParentMenu?.();
              e.stopPropagation();
            }}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 8,
            }}
          >
            <TickIcon color="#8283BE" />
            <span style={rowTextStyle}>{option.label}</span>
          </Link>
        ) : (
          <>
            <TickIcon color="#8283BE" />
            <div style={rowTextStyle}>{option.label}</div>
          </>
        )}
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem 
        style={menuItemStyle}
        onClick={handleClick}
      >
        <TickIcon color="#8283BE" />
        <div style={rowTextStyle}>{t("sales.quote.closeDocument")}</div>
        <div
          onMouseEnter={handleClick}
          style={{
            marginLeft: isRTL ? 0 : "auto",
            marginRight: isRTL ? "auto" : 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isRTL ? (
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          ) : (
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          )}
        </div>
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
            minWidth: "auto",
            width: "max-content",
          },
        }}
        MenuListProps={{
          onMouseLeave: handleClose,
        }}
      >
        {closeOptions.map((option, index) => {
          const handleClick = option.disabled || option.isLink
            ? undefined
            : handleMenuItemClick(option.onClick, option.isLink);
          return (
            <MenuItem
              key={`${option.label}-${index}`}
              disabled={option.disabled}
              onClick={handleClick}
              sx={{
                padding: "6px 12px",
                minHeight: "auto",
              }}
            >
              {option?.isLink && !option.disabled ? (
                <Link
                  href={option.href || "#"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Close menu when link is clicked
                    setAnchorEl(null);
                    onCloseParentMenu?.();
                    // Stop propagation to prevent MenuItem onClick from interfering
                    // Let Link handle navigation naturally (including right-click and middle-click)
                    e.stopPropagation();
                  }}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    gap: 8,
                  }}
                >
                  <ListItemText
                    primary={option.label}
                    primaryTypographyProps={{
                      sx: {
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: "#28293D",
                      },
                    }}
                  />
                </Link>
              ) : (
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{
                    sx: {
                      ...FONT_FAMILY.Lexend(400, 14),
                      color: "#28293D",
                    },
                  }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
