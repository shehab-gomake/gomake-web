import { MenuItem } from "@mui/material";
import { useStyle } from "./style";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { PDFIcon } from "./icons/pdf";
import { OptionsButton } from "@/components/options-button/options-button";
import { ShowIcon } from "./icons/show-file";
import CancelIcon from "@mui/icons-material/Cancel";

interface IMoreProps {
  deposit?: any;
  onClickCancel?: () => void;
  onClickShowDeposit?:(depositId: string) => void;
  onClickPdf?: () => void;
  onClickLoggers?: () => void;
}

const MoreMenuItem = ({ icon, text, onClick }) => {
  const { classes } = useStyle();
  return (
    <MenuItem onClick={onClick}>
      <div style={classes.menuRowStyle}>
        {icon}
        <div style={classes.rowTextStyle}>{text}</div>
      </div>
    </MenuItem>
  );
};

const MoreMenuWidget = ({ deposit, onClickCancel, onClickShowDeposit, onClickPdf, onClickLoggers }: IMoreProps) => {
  const { t } = useTranslation();

  return (
    <OptionsButton>
      <OptionsButton>
      <MoreMenuWidget  />
        <MoreMenuItem icon={<ShowIcon />} text={t("deposits.showDeposits")} onClick={onClickShowDeposit} />
        <MoreMenuItem icon={<EditingIcon />} text={t("sales.quote.loggers")} onClick={onClickLoggers} />
        <MoreMenuItem icon={<PDFIcon />} text={t("sales.quote.pdf")} onClick={onClickPdf} />
        <MoreMenuItem icon={<CancelIcon style={{ color: "#a1a2cd" }} />} text={t("sales.quote.cancel")} onClick={onClickCancel} />
      </OptionsButton>
    </OptionsButton>
  );
};
export { MoreMenuWidget };