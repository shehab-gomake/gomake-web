import { useState, MouseEvent } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { Popover, MenuItem, Menu, IconButton, Typography } from "@mui/material";
import { SketchPicker } from "react-color";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChangeColorIcon } from "../table-view/status-table/table-row/more-circle/icons/change-color";
import { ResetColorIcon } from "../table-view/status-table/table-row/more-circle/icons/reset-color";
import { HexColorPicker } from "react-colorful";
import { toRgba } from "@/utils/helpers";

interface ITaskCategoryLabelProps {
    label?: string;
    t?: any;
    key: any;
}

const ClickableLabelComponent = ({ label, t, key }: ITaskCategoryLabelProps) => {
    const { primaryColor } = useGomakeTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState(primaryColor(500));
    const [showColorPicker, setShowColorPicker] = useState(false);


    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleChangeColorClick = (event: MouseEvent<HTMLElement>) => {
        setShowColorPicker(true);
    };

    const handleColorPickerClose = () => {
        setShowColorPicker(false);
    };

    const handleColorChange = (newColor: any) => {
        setColor(newColor.hex);
    };

    const handleResetColor = () => {
        // setColor(primaryColor(500));
        handleMenuClose();
    }


    return (
        <>
            <span
                onClick={handleMenuClick}
                style={{
                    ...FONT_FAMILY.Lexend(600, 12),
                    color: color || primaryColor(500),
                    padding: '2px 12px',
                    backgroundColor: toRgba(color || primaryColor(50), 0.1),
                    borderRadius: 17,
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: "pointer",
                }}>
                {label}
            </span>
            <Menu
                key={`Menu-${key}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                    style: { marginTop: '10px' },
                }}
            >
                <MenuItem
                    onClick={handleChangeColorClick} >
                    <IconButton  >
                        <ChangeColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "#8283BE",
                            fontStyle: "normal",
                            lineHeight: "20px"
                        }}>
                        {t("productionFloor.changeColor")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleResetColor}>
                    <IconButton >
                        <ResetColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "#8283BE",
                            fontStyle: "normal",
                            lineHeight: "20px"
                        }}>
                        {t("productionFloor.resetColor")}
                    </Typography>
                </MenuItem>
            </Menu>
            <Popover
                key={`popover-${key}`}
                open={showColorPicker}
                onClose={handleColorPickerClose}
                 anchorEl={anchorEl} // Use the same anchor element as the menu
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <SketchPicker
                    key={`SketchPicker-${key}`}
                    color={color}
                    onChange={handleColorChange}
                />
            </Popover>
        </>
    );
};

export { ClickableLabelComponent };