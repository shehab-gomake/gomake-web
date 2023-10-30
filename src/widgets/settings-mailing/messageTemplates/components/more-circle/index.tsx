import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useTranslation } from "react-i18next";
import { EditingIcon } from "./icons/edit";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { editModalState, smsBodyState, smsSubjectState, smsTemplateState } from "@/widgets/settings-mailing/states/state";
import { useMessageTemplate } from "@/widgets/settings-mailing/useMessageTemplate";

interface IProps {
  id: any;
  item: any;
}

const MoreMenuWidget = ({ id, item }: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const [openModal, setOpenModal] = useRecoilState<boolean>(editModalState);
  const { getSmsTemplateById } = useMessageTemplate();
  const [subject, setSubject] = useRecoilState<string>(smsSubjectState);
  const [body, setBody] = useRecoilState<string>(smsBodyState);

  const handleEditClick = async () => {
    await getSmsTemplateById(id);
    setBody(item?.text);
    setSubject(item?.title);
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
