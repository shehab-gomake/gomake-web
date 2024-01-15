import { Divider, IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { ConvertIcon } from "@/pages-components/quotes/more-circle/icons/convert";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useTableCellData } from "../table-cell-data/use-table-cell-data";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";

const MaterialMenuWidget = ({ dataRow, isAdmin }) => {
  const { clasess } = useStyle();
  const { open, anchorEl, handleClose, handleClick } = useMoreCircle();
  const { t } = useTranslation();
  const { updateCellData } = useTableCellData(isAdmin);

  const toggleIsActive = async (id, parameterKey, value) => {
    await updateCellData(id, parameterKey, !value);
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem style={clasess.menuItemContainer}>
          <div style={clasess.menuRowStyle}>
            <ConvertIcon />
            <div
              style={clasess.rowTextStyle}
              onClick={() => {
                toggleIsActive(dataRow?.id, "Active", dataRow?.isActive);
              }}
            >
              {dataRow?.isActive
                ? t("remainWords.convertToInactive")
                : t("remainWords.convertToActive")}
            </div>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem style={clasess.menuItemContainer}>
          <DuplicateIcon height={20} width={20} color={clasess.iconColor} />{" "}
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.duplicate")}
          </div>
        </MenuItem>
        <Divider />
        <MenuItem style={clasess.menuItemContainer}>
          <DeleteIcon />
          <div style={clasess.rowTextStyle}>
            {t("navigationButtons.delete")}
          </div>
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { MaterialMenuWidget };
