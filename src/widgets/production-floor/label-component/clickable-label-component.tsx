import { useState, MouseEvent } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { Popover, MenuItem, Menu, IconButton, Typography } from "@mui/material";
import { SketchPicker } from "react-color";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChangeColorIcon } from "../table-view/status-table/table-row/more-circle/icons/change-color";
import { ResetColorIcon } from "../table-view/status-table/table-row/more-circle/icons/reset-color";
import { toRgba } from "@/utils/helpers";
import { useGomakeAxios } from "@/hooks";
import { resetProductionFloorJobColorApi, updateProductionFloorJobColorApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import {usePrintHousePreferences} from "@/hooks/use-print-house-preferences";

interface ITaskCategoryLabelProps {
    id: string;
    label?: any;
    t?: any;
    key: any;
    textColor: string;
}

const ClickableLabelComponent = ({ label, t, key, textColor, id }: ITaskCategoryLabelProps) => {
    const { primaryColor } = useGomakeTheme();
    const { callApi } = useGomakeAxios();
    const { GetProductionFontSizeFromPreferences } = usePrintHousePreferences();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState(textColor || primaryColor(500));
    const [initialColor, setInitialColor] = useState(color); // New state to track initial color
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleChangeColorClick = (event: MouseEvent<HTMLElement>) => {
        setInitialColor(color); // Set the initial color when opening the color picker
        setShowColorPicker(true);
    };

    const handleColorPickerClose = () => {
        setShowColorPicker(false);
        if (color !== initialColor) { // Only call onChangeJobColor if the color has changed
            onChangeJobColor();
        }
    };

    const handleColorChange = (newColor: any) => {
        setColor(newColor.hex);
    };


    const onResetJobColor = async () => {
        const callBack = (res: any) => {
            if (res.success) {
                // Handle success case
            } else {
                // Handle failure case
            }
            handleMenuClose();
        };
        await resetProductionFloorJobColorApi(callApi, callBack, { boardMissionId: id });
    };

    const onChangeJobColor = async () => {
        const callBack = (res: any) => {
            if (res.success) {
                // Handle success case
            } else {
                // Handle failure case
            }
            handleMenuClose();
        };
        await updateProductionFloorJobColorApi(callApi, callBack, {
            boardMissionId: id,
            productionFloorJobColor: color
        });
    };

    return (
        <>
            <span
                onClick={handleMenuClick}
                style={{
                    // ...FONT_FAMILY.Lexend(600, 12),
                    ...FONT_FAMILY.Lexend(500, 14),
                    color: color || primaryColor(500),
                    padding: '2px 12px',
                    backgroundColor: toRgba(color || primaryColor(50), 0.1),
                    borderRadius: 17,
                    textAlign: 'center',
                    display: 'inline-block',
                    cursor: "pointer",
                    fontSize:GetProductionFontSizeFromPreferences(),
                }}
            >
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
                <MenuItem style={{ padding: "0px 10px" }} onClick={handleChangeColorClick}>
                    <IconButton>
                        <ChangeColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "var(--theme-secondary-300, #8283BE)",
                            fontStyle: "normal",
                            lineHeight: "20px",
                        }}
                    >
                        {t("productionFloor.changeColor")}
                    </Typography>
                </MenuItem>
                <MenuItem style={{ padding: "0px 10px" }} onClick={onResetJobColor}>
                    <IconButton>
                        <ResetColorIcon />
                    </IconButton>
                    <Typography
                        style={{
                            ...FONT_FAMILY.Lexend(500, 12),
                            color: "var(--theme-secondary-300, #8283BE)",
                            fontStyle: "normal",
                            lineHeight: "20px"
                        }}
                    >
                        {t("productionFloor.resetColor")}
                    </Typography>
                </MenuItem>
            </Menu>
            <Popover
                key={`popover-${key}`}
                open={showColorPicker}
                onClose={handleColorPickerClose}
                anchorEl={anchorEl}
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
