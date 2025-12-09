import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const MoreMenuWidget = ({
  quoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  documentType,
  onClickUndoItemIntake,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, menuList, handleClose, handleClick } = useMoreCircle({
    quoteItem,
    onClickDuplicateWithDifferentQTY,
    onClickQuickDuplicate,
    onClickDeleteQouteItem,
    documentType,
    onClickUndoItemIntake,
  });

  // For purchase orders, ensure menu shows if item can be deleted or undone
  const isPurchaseOrder = documentType === DOCUMENT_TYPE.purchaseOrder;
  const canDelete = isPurchaseOrder && quoteItem?.isDeletable;
  const canUndoIntake = isPurchaseOrder && quoteItem?.isIntake === true;
  const hasDeleteOrUndo = canDelete || canUndoIntake;
  
  // Filter menu items - show items that meet their condition OR are special purchase order items
  const filteredMenuList = menuList.filter((item: any) => {
    if (item?.condition) return true;
    // For purchase orders, show delete option if item is deletable (even if other conditions fail)
    if (canDelete && item?.name === "delete") {
      return true;
    }
    // For purchase orders, show undo intake ONLY if isIntake === true
    if (canUndoIntake && item?.name === "undoItemIntake") {
      return true;
    }
    return false;
  });

  // Show menu if there are items to display
  const shouldShowMenu = filteredMenuList.length > 0;

  return (
    <>
      {shouldShowMenu && (
        <IconButton onClick={handleClick}>
          <MoreCircleIcon />
        </IconButton>
      )}
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {filteredMenuList.map((item, index) => {
          return (
            <div key={index}>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => {
                    e.preventDefault();
                    item.onclick();
                  }}
                >
                  <MenuItem style={classes.menuItemContainer}>
                    {item.icon}
                    <div style={classes.menuTitleStyle}>
                      {t(`sales.quote.${item?.name}`)}
                    </div>
                  </MenuItem>
                </a>
              ) : (
                <MenuItem
                  style={classes.menuItemContainer}
                  onClick={item.onclick}
                >
                  {item.icon}
                  <div style={classes.menuTitleStyle}>
                    {t(`sales.quote.${item?.name}`)}
                  </div>
                </MenuItem>
              )}
              {index !== filteredMenuList.length - 1 ? (
                <div style={classes.lineStyle} />
              ) : null}
            </div>
          );
        })}
      </GoMakeMenu>
    </>
  );
};

export { MoreMenuWidget };
