import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "../enums";
import { PDFIcon } from "./icons/pdf";
import { OptionsButton } from "@/components/options-button/options-button";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const MoreMenuWidget = ({ quote, onClickOpenModal , onClickPdf , onClickDuplicate }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { user, navigate } = useMoreCircle();

  return (
    <OptionsButton>
      <MenuItem>
        <div style={classes.menuRowStyle}>
          <PermissionCheck userPermission={Permissions.SHOW_LOGGERS_QUOTE}>
            <EditingIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.loggers")}</div>
          </PermissionCheck>
        </div>
      </MenuItem>
      <MenuItem onClick={()=>onClickPdf(quote?.id)}>
        <div style={classes.menuRowStyle}>
          <PDFIcon />
          <div style={classes.rowTextStyle}>{t("sales.quote.pdf")}</div>
        </div>
      </MenuItem>
      <MenuItem onClick={()=>onClickDuplicate(quote?.id)}>
        <div style={classes.menuRowStyle}>
          <ConvertIcon />
          <div style={classes.rowTextStyle}>{t("sales.quote.duplicate")}</div>
        </div>
      </MenuItem>
      {(quote?.statusID === QUOTE_STATUSES.Create &&
        quote?.userID === user?.id) ||
        quote?.statusID === QUOTE_STATUSES.Open ? (
        <MenuItem
          onClick={() =>
            quote?.statusID === QUOTE_STATUSES.Create
              ? navigate(`/quote`)
              : onClickOpenModal(quote)
          }
        >
          <div style={classes.menuRowStyle}>
            <EditingIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.edit")}</div>
          </div>
        </MenuItem>
      ) : null}
    </OptionsButton>
  );
};
export { MoreMenuWidget };
