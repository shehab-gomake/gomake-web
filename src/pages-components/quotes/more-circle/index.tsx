import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "../enums";

const MoreMenuWidget = ({ quote }: any) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const { open, anchorEl, user, handleClose, handleClick, navigate } =
    useMoreCircle();
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => navigate(`/settings/products/edit/${quote?.id}`)}
        >
          <div style={clasess.menuRowStyle}>
            <EditingIcon />
            <div style={clasess.rowTextStyle}>Loggers</div>
          </div>
        </MenuItem>
        <MenuItem>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div style={clasess.rowTextStyle}>inspection</div>
          </div>
        </MenuItem>
        <MenuItem>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div style={clasess.rowTextStyle}>Duplication</div>
          </div>
        </MenuItem>
        {(quote?.statusID === QUOTE_STATUSES.Create &&
          quote?.userID === user?.id) ||
        quote?.statusID === QUOTE_STATUSES.Open ? (
          <MenuItem>
            <div style={clasess.menuRowStyle}>
              <EditingIcon />
              <div style={clasess.rowTextStyle}>edit</div>
            </div>
          </MenuItem>
        ) : null}
      </GoMakeMenu>
    </>
  );
};
export { MoreMenuWidget };
