import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useTranslation } from "react-i18next";
import { EditingIcon } from "./icons/edit";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { editModalState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";
import { useSetRecoilState } from "recoil";

interface IProps {
  id: any;
  item: any;
}
const MoreMenuWidget = ({ id, item }: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const { getSmsTemplateById } = useMessageTemplate();
  const setOpenModal = useSetRecoilState<boolean>(editModalState);

  const handleEditClick = async () => {
    await getSmsTemplateById(id);
    setOpenModal(true);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem onClick={handleEditClick}>
          <div style={classes.menuRowStyle}>
            <EditingIcon />
            <div style={classes.rowTextStyle}>{t("mailingSettings.Edit")}</div>
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
