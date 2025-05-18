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
}

const ExcelMenu = ({
  onGenerateReportClick,
  onExportTableClick,
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
          <div style={classes.rowTextStyle}>{t("sales.list.exportTable")}</div>
        </MenuItem>
      </Menu>
    </div>
  );
};

export { ExcelMenu };

// import { IconButton, Menu, MenuItem } from "@mui/material";
// import { SettingsIcon } from "@/icons/settings";
// import { DownloadExcelSheet } from "@/icons/material-tabs/download-excel-sheet";
// import { useTranslation } from "react-i18next";
// import { useStyle } from "./style";
// import { useState } from "react";

// interface IActionMenuProps {
// onGenerateReportClick: () => void;
// onExportTableClick?: () => void;
// }

// const ExcelMenuDraft = (props: IActionMenuProps) => {
//   const { classes } = useStyle();
//   const { t } = useTranslation();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//   const handleOpenMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <IconButton onClick={handleOpenMenu} size="small">
//         <SettingsIcon stroke={"#7E7E7E"} width={25} height={25} />
//       </IconButton>
//       <Menu
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={handleCloseMenu}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
//         onClick={handleCloseMenu}
//       >
//         <MenuItem
//           style={classes.menuItemContainer}
//           onClick={() => {
//             handleCloseMenu();
//             props?.onGenerateReportClick();
//           }}
//         >
//           <div style={classes.actionIconStyle}>
//             <DownloadExcelSheet />
//           </div>
//           <div style={classes.rowTextStyle}>{t("sales.list.generateReport")}</div>
//         </MenuItem>

//         <MenuItem
//           style={classes.menuItemContainer}
//           onClick={() => {
//             handleCloseMenu();
//             props?.onExportTableClick();
//           }}
//         >
//           <div style={classes.actionIconStyle}>
//             <DownloadExcelSheet />
//           </div>
//           <div style={classes.rowTextStyle}>{t("sales.list.exportTable")}</div>
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// export { ExcelMenuDraft };
