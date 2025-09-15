import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Tooltip } from "@mui/material";
import { ExcelSheetIcon } from "@/icons";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import {
  DOCUMENT_TYPE,
  INVOICES_EXPORT_TYPES,
} from "@/pages-components/quotes/enums";

interface ExcelMenuProps {
  onGenerateReportClick?: () => void;
  onExportTableClick?: (exportType?: INVOICES_EXPORT_TYPES) => void;
  onExportTablePdfClick?: () => void;
  documentType?: DOCUMENT_TYPE;
}

const ExcelMenu = ({
  onGenerateReportClick,
  onExportTableClick,
  onExportTablePdfClick,
  documentType,
}: ExcelMenuProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const direction = t("direction");
  const [anchorExcelEl, setAnchorExcelEl] = useState<null | HTMLElement>(null);

  const handleExcelIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorExcelEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorExcelEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleExcelIconClick} sx={classes.iconButton}>
        <FileDownloadOutlinedIcon
          sx={{
            color: "#2e3092",
            fontSize: "22px",
            transition: "color 0.2s ease-in-out",
          }}
        />
      </IconButton>
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
        {(documentType == DOCUMENT_TYPE.invoice ||
          documentType == DOCUMENT_TYPE.invoiceRefund) && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onExportTableClick(INVOICES_EXPORT_TYPES.ExtendedExcel);
            }}
          >
            <div style={classes.rowTextStyle}>
              {t("sales.list.exportExtendedTableExcel")}
            </div>
          </MenuItem>
        )}
        {(documentType == DOCUMENT_TYPE.invoice ||
          documentType == DOCUMENT_TYPE.invoiceRefund) && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onExportTableClick(INVOICES_EXPORT_TYPES.ExtendedTxt);
            }}
          >
            <div style={classes.rowTextStyle}>
              {t("sales.list.exportExtendedTableTxt")}
            </div>
          </MenuItem>
        )}
        {(documentType == DOCUMENT_TYPE.invoice ||
          documentType == DOCUMENT_TYPE.invoiceRefund) && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onExportTableClick(INVOICES_EXPORT_TYPES.SummeryExcelWithVat);
            }}
          >
            <div style={classes.rowTextStyle}>
              {t("sales.list.exportSummeryExcelWithVat")}
            </div>
          </MenuItem>
        )}
        {(documentType == DOCUMENT_TYPE.invoice ||
          documentType == DOCUMENT_TYPE.invoiceRefund) && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onExportTableClick(INVOICES_EXPORT_TYPES.SummeryExcelWithoutVat);
            }}
          >
            <div style={classes.rowTextStyle}>
              {t("sales.list.exportSummeryExcelWithoutVat")}
            </div>
          </MenuItem>
        )}
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
