import React, { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";

interface IPurchasePricingInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

// Mock data for purchase pricing child table
const mockPurchasePricingData = [
    {
        purchaseOrderM2Cost: "0.070",
        purchaseOrderRollCost: "5800",
        currency: "Dollar",
        supplyingTime: "5"
    },
    {
        purchaseOrderM2Cost: "0.071",
        purchaseOrderRollCost: "5750",
        currency: "Dollar",
        supplyingTime: "3"
    },
    {
        purchaseOrderM2Cost: "0.073",
        purchaseOrderRollCost: "5850",
        currency: "Dollar",
        supplyingTime: "7"
    },
    {
        purchaseOrderM2Cost: "0.073",
        purchaseOrderRollCost: "5850",
        currency: "Dollar",
        supplyingTime: "4"
    }
];

const PurchasePricingInput = ({ value, isAdmin, id }: IPurchasePricingInputProps) => {
    const { t } = useTranslation();
    const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);
    const isExpanded = openChildTable.rowId === id && openChildTable.tableType === 'purchasePricing';

    const toggleExpanded = () => {
        if (isExpanded) {
            setOpenChildTable({ rowId: '', tableType: null });
        } else {
            setOpenChildTable({ rowId: id, tableType: 'purchasePricing' });
        }
    };

    return (
        <Box>
            <Button
                variant="contained"
                color="primary"
                onClick={toggleExpanded}
                size="small"
                sx={{
                    backgroundColor: '#9c27b0',
                    minWidth: '60px',
                    width: '60px',
                    '&:hover': {
                        backgroundColor: '#7b1fa2',
                    }
                }}
            >
                {isExpanded ? "Hide" : "Open"}
            </Button>
        </Box>
    );
};

export { PurchasePricingInput };
