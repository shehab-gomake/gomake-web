import { useState, MouseEvent } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { Popover, MenuItem, Menu, IconButton, Typography } from "@mui/material";
import { SketchPicker } from "react-color"; // Importing react-color's SketchPicker
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChangeColorIcon } from "../table-view/status-table/table-row/more-circle/icons/change-color";
import { ResetColorIcon } from "../table-view/status-table/table-row/more-circle/icons/reset-color";
import { HexColorPicker } from "react-colorful";

interface ITaskCategoryLabelProps {
    label?: string;
}

const ClickableLabelComponent = ({ label }: ITaskCategoryLabelProps) => {
    const { primaryColor } = useGomakeTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState(primaryColor(500)); 
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleChangeColorClick = (event: MouseEvent<HTMLElement>) => {
        setColorAnchorEl(event.currentTarget);
        setShowColorPicker(true);
        handleMenuClose();
    };

    const handleColorPickerClose = () => {
        setColorAnchorEl(null);
        setShowColorPicker(false);
    };

    const handleColorChange = (newColor: any) => {
        setColor(newColor.hex);
        //setColor(newColor);
    };

    const handleResetColor = () => {
        setColor(primaryColor(500));
        handleMenuClose();
    };

    return (
        <>
            <span
                onClick={handleMenuClick}
                style={{
                    ...FONT_FAMILY.Lexend(600, 12),
                    color: color || primaryColor(500),
                    padding: '2px 12px',
                    backgroundColor: primaryColor(50),
                    borderRadius: 17,
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: "pointer",
                }}>
                {label}
            </span>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                    style: { marginTop: '10px' }, 
                }}
            >
                <MenuItem onClick={handleChangeColorClick} >
                    <IconButton edge="start" >
                        <ChangeColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "#8283BE",
                            fontStyle: "normal",
                            lineHeight: "20px"
                        }}>
                        Change Color
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleResetColor}>
                    <IconButton edge="start" >
                        <ResetColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "#8283BE",
                            fontStyle: "normal",
                            lineHeight: "20px"
                        }}>
                        Reset Color
                    </Typography>
                </MenuItem>
            </Menu>
            <Popover
                open={showColorPicker}
                anchorEl={colorAnchorEl}
                onClose={handleColorPickerClose}
                PaperProps={{
                    onClick: (e) => e.stopPropagation(),
                }}
            >
                <SketchPicker color={color} onChange={handleColorChange} />
                {/* <HexColorPicker
                    color={color}
                    onChange={handleColorChange}
                /> */}
            </Popover>
        </>
    );
};

export { ClickableLabelComponent };