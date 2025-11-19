import React, { useState } from "react";
import { MenuItem, Menu, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { FONT_FAMILY } from "@/utils/font-family";

interface SendToCustomerSubmenuProps {
    onClickEmail: () => void;
    onClickSMS: () => void;
    onClickWhatsApp: () => void;
    menuItemStyle?: any;
    rowTextStyle?: any;
    onCloseParentMenu?: () => void;
}

export const SendToCustomerSubmenu: React.FC<SendToCustomerSubmenuProps> = ({
    onClickEmail,
    onClickSMS,
    onClickWhatsApp,
    menuItemStyle,
    rowTextStyle,
    onCloseParentMenu,
}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event?: React.MouseEvent) => {
        event?.stopPropagation();
        setAnchorEl(null);
    };

    const handleMenuItemClick = (callback: () => void) => (event: React.MouseEvent) => {
        event.stopPropagation();
        handleClose();
        onCloseParentMenu?.();
        callback();
    };

    return (
        <>
            <MenuItem
                style={menuItemStyle}
                onClick={handleClick}
                onMouseEnter={handleClick}
            >
                <EmailOutlinedIcon sx={{ fontSize: 20, mr: 1, color: "#8283BE" }} />
                <div style={rowTextStyle}>{t("sales.quote.sendToClient")}</div>
                <ChevronRightIcon sx={{ ml: "auto", fontSize: 20 }} />
            </MenuItem>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        border: "1px solid #cbcbe4",
                        borderRadius: "8px",
                        minWidth: 180,
                    },
                }}
                MenuListProps={{
                    onMouseLeave: handleClose,
                }}
            >
                <MenuItem onClick={handleMenuItemClick(onClickEmail)}>
                    <ListItemIcon>
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
                    <ListItemIcon>
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
                    <ListItemIcon>
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

