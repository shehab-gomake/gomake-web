import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useTranslation } from "react-i18next";
import { EditingIcon } from "./icons/edit";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { DeleteIcon } from "./icons/delete";
import { useRecoilState } from "recoil";
import { smsTemplateState, editModalState, subjectTextState } from "@/widgets/settings-mailing/states/state";

const MoreMenuWidget = ({ item, onClickDelete }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const [subjectText, setSubjectText] = useRecoilState<any>(subjectTextState);
  const [openModal, setOpenModal] = useRecoilState<boolean>(editModalState);
  const [state, setState] = useRecoilState<any>(smsTemplateState);
  
  const handleEditClick =  () => {
    setState(item);
    setSubjectText(item?.title);
    setOpenModal(true);
  };

  // const handleDeleteClick = async () => {
  //   onClickDelete(item);
  // };

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
        {/* <MenuItem onClick={handleDeleteClick}>
          <div style={classes.menuRowStyle}>
            <DeleteIcon />
            <div style={classes.rowTextStyle}>
              {t("mailingSettings.Delete")}
            </div>
          </div>
        </MenuItem> */}
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
