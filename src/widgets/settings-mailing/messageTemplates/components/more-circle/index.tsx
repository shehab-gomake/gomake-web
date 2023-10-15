import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useTranslation } from "react-i18next";
import { EditingIcon } from "./icons/edit";
import { DuplicateIcon } from "@/components/icons/icons";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { DeleteIcon } from "./icons/delete";

const MoreMenuWidget = ({ item,  onClickEdit , onClickDuplicate , onClickDelete }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();

  const handleEditClick = async () => {
    onClickEdit(item.id);
  };
  const handleDuplicateClick = async () => {
    onClickDuplicate(item.id);
  };
  const handleDeleteClick = async () => {
    onClickDelete(item.id);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem onClick={() => alert("edit")}>
          <div style={classes.menuRowStyle}>
            <EditingIcon />
            <div style={classes.rowTextStyle}>{t("mailingSettings.Edit")}</div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => alert("duplicate")}>
          <div style={classes.menuRowStyle}>
            <DuplicateIcon />
            <div style={classes.rowTextStyle}>
               {t("mailingSettings.Duplicate")} 
            </div>
          </div>
        </MenuItem>
        <MenuItem onClick={() => alert("delete")}>
          <div style={classes.menuRowStyle}>
            <DeleteIcon />
            <div style={classes.rowTextStyle}>
               {t("mailingSettings.Delete")} 
            </div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
