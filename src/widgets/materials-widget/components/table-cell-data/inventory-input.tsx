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

        <Button
            onClick={toggleExpanded}
            startIcon={
                isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
            sx={{
                backgroundColor: buttonColor,
                color: '#ffffff',
                height: "35px",
                minWidth: "90px",
                padding: "6px 12px",
                width: "fit-content",
                margin: 0,
                "&:hover": {
                    opacity: 0.7,
                    backgroundColor: buttonColor,
                    color: '#ffffff',
                },

            }}
        >
            <Box
                component="span"
                sx={{
                    ...FONT_FAMILY.Lexend(500, 14),
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {value || '0'}

            </Box>
        </Button>
    );
};

export { InventoryInput };
