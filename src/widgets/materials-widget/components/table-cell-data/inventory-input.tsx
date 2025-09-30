import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
    const { secondColor } = useGomakeTheme();
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
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Button
                variant="contained"
                onClick={toggleExpanded}
                size="small"
                sx={{
                    backgroundColor: buttonColor,
                    color: '#ffffff',
                    minWidth: '70px',
                    width: 'auto',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                        backgroundColor: buttonColor,
                        filter: 'brightness(0.9)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                {value || '0'}
                <Box
                    component="span"
                    sx={{
                        fontSize: '12px',
                        marginLeft: '6px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {isExpanded ? '▲' : '▼'}
                </Box>
            </Button>
        </Box>
    );
};

export { InventoryInput };
