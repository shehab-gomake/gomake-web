import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { ExcelSheetIcon } from "@/icons";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

interface ExcelMenuProps {
  onGenerateReportClick?: () => void;
  onExportTableClick?: () => void;
  onExportTablePdfClick?: () => void;
}

const ExcelMenu = ({
  onGenerateReportClick,
  onExportTableClick,
  onExportTablePdfClick,
}: ExcelMenuProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const direction = t("direction");
  const [anchorExcelEl, setAnchorExcelEl] = useState<null | HTMLElement>(null);

  const handleExcelIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorExcelEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorExcelEl(null);
  };

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={handleExcelIconClick}>
        <ExcelSheetIcon />
      </div>

      <Menu
        anchorEl={anchorExcelEl}
        open={Boolean(anchorExcelEl)}
        onClose={handleMenuClose}
        anchorOrigin={
          direction === "rtl"
            ? { vertical: "bottom", horizontal: "left" }
            : { vertical: "bottom", horizontal: "right" }
        }
        transformOrigin={
          direction === "rtl"
            ? { vertical: "top", horizontal: "left" }
            : { vertical: "top", horizontal: "right" }
        }
      >
        {onGenerateReportClick && (
          <PermissionCheck userPermission={Permissions.GENERATE_REPORT}>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onGenerateReportClick();
              }}
            >
              <div style={classes.rowTextStyle}>
                {t("sales.list.generateReport")}
              </div>
            </MenuItem>
          </PermissionCheck>
        )}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onExportTableClick();
          }}
        >
          <div style={classes.rowTextStyle}>
            {t("sales.list.exportTableExcel")}
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onExportTablePdfClick();
          }}
        >
          <div style={classes.rowTextStyle}>
            {t("sales.list.exportTablePdf")}
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export { ExcelMenu };
