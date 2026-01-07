import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const MoreMenuWidget = ({ item, updatedStatus, onClickEdit }: any) => {
  const { classes, primarySecondaryBlend } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, handleClick, updatedCustomerStatus } =
    useMoreCircle({
      updatedStatus,
    });

  const handleEditClick = async () => {
    onClickEdit(item.id);
  };

  return (
    <>
      <PermissionCheck userPermission={Permissions.EDIT_CLIENT}>
        <IconButton onClick={handleClick}>
          <MoreCircleIcon color={primarySecondaryBlend(500)} />
        </IconButton>
        <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
          <MenuItem onClick={handleEditClick}>
            <div style={classes.menuRowStyle}>
              <EditingIcon color={primarySecondaryBlend(500)} />
              <div style={classes.rowTextStyle}>{t("remainWords.editing")}</div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => updatedCustomerStatus(item)}>
            <div style={classes.menuRowStyle}>
              <ConvertIcon color={primarySecondaryBlend(500)} />
              <div style={classes.rowTextStyle}>
                {item?.isActive
                  ? t("remainWords.convertToInactive")
                  : t("remainWords.convertToActive")}
              </div>
            </div>
          </MenuItem>
        </GoMakeMenu>
      </PermissionCheck>
    </>
  );
};
export { MoreMenuWidget };
