import React, { useState } from "react";
import { MenuItem, Menu, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { FONT_FAMILY } from "@/utils/font-family";
import { PayIcon } from "./icons/pay";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
interface SendPaymentSubmenuProps {
  onClickEmail: () => void;
  onClickSMS: () => void;
  onClickWhatsApp: () => void;
  menuItemStyle?: any;
  rowTextStyle?: any;
  onCloseParentMenu?: () => void;
}

export const SendPaymentSubmenu: React.FC<SendPaymentSubmenuProps> = ({
  onClickEmail,
  onClickSMS,
  onClickWhatsApp,
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

  const handleClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleMenuItemClick =
    (callback: () => void) => (event: React.MouseEvent) => {
      event.stopPropagation();
      handleClose();
      onCloseParentMenu?.();
      callback();
    };

  return (
    <>
      <MenuItem style={menuItemStyle} onClick={handleClick}>
        <PayIcon color="#8283BE" />
        <div style={rowTextStyle}>{t("sales.quote.sendPayment")}</div>
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
            minWidth: 180,
          },
        }}
        MenuListProps={{
          onMouseLeave: handleClose,
        }}
      >
        <MenuItem onClick={handleMenuItemClick(onClickEmail)}>
          <ListItemIcon
            sx={{ minWidth: "auto", mr: isRTL ? 0 : 0.5, ml: isRTL ? 0.5 : 0 }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 20, color: "#8283BE" }} />
          </ListItemIcon>
          <ListItemText
            primary={t("sales.quote.email")}
            primaryTypographyProps={{
              sx: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: "#28293D",
              },
            }}
          />
        </MenuItem>

        <MenuItem onClick={handleMenuItemClick(onClickSMS)}>
          <ListItemIcon
            sx={{ minWidth: "auto", mr: isRTL ? 0 : 0.5, ml: isRTL ? 0.5 : 0 }}
          >
            <PhoneAndroidIcon sx={{ fontSize: 20, color: "#8283BE" }} />
          </ListItemIcon>
          <ListItemText
            primary={t("sales.quote.phone")}
            primaryTypographyProps={{
              sx: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: "#28293D",
              },
            }}
          />
        </MenuItem>

        <MenuItem onClick={handleMenuItemClick(onClickWhatsApp)}>
          <ListItemIcon
            sx={{ minWidth: "auto", mr: isRTL ? 0 : 0.5, ml: isRTL ? 0.5 : 0 }}
          >
            <WhatsAppIcon sx={{ fontSize: 20, color: "#8283BE" }} />
          </ListItemIcon>
          <ListItemText
            primary={t("sales.quote.whatsApp")}
            primaryTypographyProps={{
              sx: {
                ...FONT_FAMILY.Lexend(400, 14),
                color: "#28293D",
              },
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
