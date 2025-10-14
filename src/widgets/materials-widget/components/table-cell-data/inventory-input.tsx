import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FONT_FAMILY } from "@/utils/font-family";

interface IInventoryInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
    minStock?: number;
    optimalStock?: number;
    currentInventory?: number;
}

const InventoryInput = ({ value, isAdmin, id, minStock, optimalStock, currentInventory }: IInventoryInputProps) => {
    const { t } = useTranslation();
    const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);
    const isExpanded = openChildTable.rowId === id && openChildTable.tableType === 'inventory';
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const toggleExpanded = () => {
        if (isExpanded) {
            setOpenChildTable({ rowId: '', tableType: null });
        } else {
            setOpenChildTable({ rowId: id, tableType: 'inventory' });
        }
    };

    // Determine button color based on stock levels
    const getButtonColor = () => {
        const inventory = currentInventory || parseInt(value) || 0;
        const minStockValue = minStock || 0;
        const optimalStockValue = optimalStock || 0;

        if (inventory >= optimalStockValue) {
            return '#66D671'; // Green - Good stock
        } else if (inventory >= minStockValue && inventory < optimalStockValue) {
            return '#F0CA45'; // Orange - Low stock
        } else {
            return '#E15656'; // Red - Critical stock
        }
    };

    const buttonColor = getButtonColor();

    return (
        <Box
            onClick={toggleExpanded}
            sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: buttonColor,
                color: '#ffffff',
                height: "35px",
                minWidth: "90px",
                padding: "0px 4px",
                width: "100%",
                cursor: "pointer",
                "&:hover": {
                    opacity: 0.7,
                    backgroundColor: buttonColor,
                    color: '#ffffff',
                },

            }}
        >
            <>
                {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </>
            <Box
                component="span"
                sx={{
                    ...FONT_FAMILY.Lexend(500, 14),
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                {value || '0'}

            </Box>

        </Box>
    );
};

export { InventoryInput };
