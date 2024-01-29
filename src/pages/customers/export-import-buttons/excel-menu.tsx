import { IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useRef, useState } from "react";
import { useStyle } from "./style";
import { DownloadExcelSheet } from "@/icons/material-tabs/download-excel-sheet";
import { UploadExcelSheet } from "@/icons/material-tabs/upload-excel-sheet";

interface IActionMenuProps {
    onClickImport?: any;
}
const ExcelMenu = (props: IActionMenuProps) => {
    const { classes } = useStyle();
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
            <IconButton onClick={handleMoreOptionIconClick}>
                <SettingsIcon stroke={"#000000"} />
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

                    onClick={() => alert("hey")}
                >
                    <div style={classes.actionIconStyle}>
                        <DownloadExcelSheet />             </div>
                    <div style={classes.rowTextStyle}>
                        {"Download Excel"}
                    </div>
                </MenuItem>
                <MenuItem
                    style={classes.menuItemContainer}
                    onClick={() => alert("laa")}
                >
                    <div style={classes.actionIconStyle}>
                        <UploadExcelSheet />
                    </div>
                    <div style={classes.rowTextStyle}>
                        {"Upload Excel"}
                    </div>
                </MenuItem>
            </Menu>
        </>
    );
};

export { ExcelMenu };
