import { Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useState } from "react";
import { DownloadExcelSheet } from "@/icons/material-tabs/download-excel-sheet";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components/button/button";
import { ArrowDownNewIcon } from "@/icons";

interface IActionMenuProps {
  onClickDownloadExcel: () => void;
}

const ExcelMenu = (props: IActionMenuProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <GomakePrimaryButton
        style={classes.printBtn}
        leftIcon={<SettingsIcon width={25} height={25} />}
        rightIcon={<ArrowDownNewIcon color="#fff" />}
        onClick={handleMoreOptionIconClick}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          style: {
            marginTop: 6,
          },
        }}
        onClick={handleCloseMenu}
      >
        <MenuItem
          style={classes.menuItemContainer}
          onClick={props.onClickDownloadExcel}
        >
          <div style={classes.actionIconStyle}>
            <DownloadExcelSheet />
          </div>
          <div style={classes.rowTextStyle}>
            {t("materialsActions.DownLoadExcel")}
          </div>
        </MenuItem>
      </Menu>
    </>
  );
};

export { ExcelMenu };
