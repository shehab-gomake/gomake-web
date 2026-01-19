import { IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useRef, useState } from "react";
import { useStyle } from "./style";
import { DownloadExcelSheet } from "@/icons/material-tabs/download-excel-sheet";
import { UploadExcelSheet } from "@/icons/material-tabs/upload-excel-sheet";
import { useTranslation } from "react-i18next";

interface IActionMenuProps {
  onClickImport: (file) => void;
  onClickExport: () => void;
}

const ExcelMenu = (props: IActionMenuProps) => {
  const { classes, neutralColor, primarySecondaryBlend } = useStyle();
  const { t } = useTranslation();
  const elementRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMoreOptionIconClick} size="small">
        <SettingsIcon stroke={neutralColor(600)} width={25} height={25} />
      </IconButton>
      <input
        ref={elementRef}
        onChange={props.onClickImport}
        type="file"
        accept=".xlsx"
        hidden={true}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        <MenuItem
          style={classes.menuItemContainer}
          onClick={props.onClickExport}
        >
          <div style={classes.actionIconStyle}>
            <DownloadExcelSheet color={primarySecondaryBlend(400)} />
          </div>
          <div style={classes.rowTextStyle}>
            {t("materialsActions.DownLoadExcel")}
          </div>
        </MenuItem>
        <MenuItem
          style={classes.menuItemContainer}
          onClick={() => elementRef && elementRef.current.click()}
        >
          <div style={classes.actionIconStyle}>
            <UploadExcelSheet color={primarySecondaryBlend(400)} />
          </div>
          <div style={classes.rowTextStyle}>
            {t("materialsActions.UploadExcel")}
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export { ExcelMenu };
