import React, { useState, useCallback } from "react";
import { MenuItem, Menu } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TickCancelIcon } from "@/icons";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface CancelDocumentSubmenuProps {
  quote: any;
  onClickOpenIrrelevantModal: (quote: any) => void;
  onClickOpenPriceModal?: (quote: any) => void;
  onClickOpenDeliveryTimeModal?: (quote: any) => void;
  onClickOpenModal?: (quote: any) => void;
  menuItemStyle?: any;
  rowTextStyle?: any;
  onCloseParentMenu?: () => void;
}

export const CancelDocumentSubmenu: React.FC<CancelDocumentSubmenuProps> = ({
  quote,
  onClickOpenIrrelevantModal,
  onClickOpenPriceModal,
  onClickOpenDeliveryTimeModal,
  onClickOpenModal,
  menuItemStyle,
  rowTextStyle,
  onCloseParentMenu,
}) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const isRTL = direction === "rtl";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { primarySecondaryBlend } = useGomakeTheme();

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

  // Build cancel options - always show all 4 options
  const cancelOptions = [
    {
      label: t("sales.quote.irrelevant"),
      onClick: () => onClickOpenIrrelevantModal(quote),
    },
    {
      label: t("sales.quote.price"),
      onClick: () => onClickOpenPriceModal?.(quote),
      disabled: !onClickOpenPriceModal,
    },
    {
      label: t("sales.quote.deliveryTime"),
      onClick: () => onClickOpenDeliveryTimeModal?.(quote),
      disabled: !onClickOpenDeliveryTimeModal,
    },
    {
      label: t("sales.quote.other"),
      onClick: () => onClickOpenModal?.(quote),
      disabled: !onClickOpenModal,
    },
  ];

  // If only one option (irrelevant), render it directly without submenu
  if (cancelOptions.length === 1) {
    return (
      <MenuItem
        style={menuItemStyle}
        onClick={handleMenuItemClick(cancelOptions[0].onClick)}
      >
        <TickCancelIcon color="var(--theme-secondary-300, #8283BE)" />
        <div style={rowTextStyle}>{cancelOptions[0].label}</div>
      </MenuItem>
    );
  }

  return (
    <>
      <MenuItem style={menuItemStyle} onClick={handleClick}>
        <TickCancelIcon color="var(--theme-secondary-300, #8283BE)" />
        <div style={rowTextStyle}>{t("sales.quote.cancel")}</div>
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
            border: `1px solid ${primarySecondaryBlend(100)}`,
            borderRadius: "8px",
            minWidth: 160,
          },
        }}
        MenuListProps={{
          onMouseLeave: handleClose,
        }}
      >
        {cancelOptions.map((option, index) => {
          const handleClick = handleMenuItemClick(option.onClick);
          return (
            <MenuItem
              key={`${option.label}-${index}`}
              onClick={handleClick}
              disabled={option.disabled}
              sx={{
                fontSize: "14px",
                padding: "8px 16px",
                minHeight: "36px",
              }}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
