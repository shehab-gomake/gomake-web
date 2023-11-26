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

const MoreMenuWidget = ({ quote, onClcikOpenModal }: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { user, navigate } = useMoreCircle();
  return (
    <OptionsButton>
      <MenuItem>
        <div style={clasess.menuRowStyle}>
          <PermissionCheck userPermission={Permissions.SHOW_LOGGERS_ORDER}>
              <EditingIcon />
              <div style={clasess.rowTextStyle}>{t("sales.quote.loggers")}</div>
          </PermissionCheck>
      
        </div>
      </MenuItem>
      <MenuItem>
        <div style={clasess.menuRowStyle}>
          <PDFIcon />
          <div style={clasess.rowTextStyle}>{t("sales.quote.pdf")}</div>
        </div>
      </MenuItem>
      <MenuItem>
        <div style={clasess.menuRowStyle}>
          <ConvertIcon />
          <div style={clasess.rowTextStyle}>{t("sales.quote.duplicate")}</div>
        </div>
      </MenuItem>
      {(quote?.statusID === QUOTE_STATUSES.Create &&
        quote?.userID === user?.id) ||
      quote?.statusID === QUOTE_STATUSES.Open ? (
        <MenuItem
          onClick={() =>
            quote?.statusID === QUOTE_STATUSES.Create
              ? navigate(`/quote`)
              : onClcikOpenModal(quote)
          }
        >
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>{t("sales.quote.edit")}</div>
          </div>
        </MenuItem>
      ) : null}
    </OptionsButton>
  );
};
export { MoreMenuWidget };
