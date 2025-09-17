import React, { useState, useEffect } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";

interface IInventoryInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

// Mock data for inventory child table
const mockInventoryData = [
    {
        supplierName: "Fares",
        code: "1234",
        purchaseM2Price: "0.070",
        purchaseRollPrice: "5800",
        purchaseCurrency: "Dollar",
        saleM2Price: "0.080",
        saleRollPrice: "5800",
        saleCurrency: "Dollar",
        lengthStock: "20",
        client: "Tirapress",
        jobs: "Show"
    },
    {
        supplierName: "Fares",
        code: "1234-B",
        purchaseM2Price: "0.071",
        purchaseRollPrice: "5750",
        purchaseCurrency: "Dollar",
        saleM2Price: "0.082",
        saleRollPrice: "5750",
        saleCurrency: "Dollar",
        lengthStock: "12",
        client: "BluePrint",
        jobs: "Show"
    },
    {
        supplierName: "mohand",
        code: "7852",
        purchaseM2Price: "0.073",
        purchaseRollPrice: "5850",
        purchaseCurrency: "Dollar",
        saleM2Price: "0.080",
        saleRollPrice: "5850",
        saleCurrency: "Dollar",
        lengthStock: "50",
        client: "Tirapress",
        jobs: "Show"
    },
    {
        supplierName: "Aous",
        code: "7852",
        purchaseM2Price: "0.073",
        purchaseRollPrice: "5850",
        purchaseCurrency: "Dollar",
        saleM2Price: "0.080",
        saleRollPrice: "5850",
        saleCurrency: "Dollar",
        lengthStock: "50",
        client: "—",
        jobs: "Show"
    }
];

const InventoryInput = ({ value, isAdmin, id }: IInventoryInputProps) => {
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

export { InventoryInput };
