import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useTranslation } from "react-i18next";
import { EditingIcon } from "./icons/edit";
import { DuplicateIcon } from "@/components/icons/icons";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { DeleteIcon } from "./icons/delete";

const MoreMenuWidget = ({ item, updatedStatus, onClickEdit }: any) => {
  const { clasess } = useStyle();
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
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem onClick={handleEditClick}>
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>{t("mailingSettings.Edit")}</div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => updatedCustomerStatus(item)}>
          <div style={clasess.menuRowStyle}>
            <DuplicateIcon />
            <div style={clasess.rowTextStyle}>
               {t("mailingSettings.Duplicate")} 
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => updatedCustomerStatus(item)}>
          <div style={clasess.menuRowStyle}>
            <DeleteIcon />
            <div style={clasess.rowTextStyle}>
               {t("mailingSettings.Delete")} 
            </div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
