import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { openChildTableState } from "../../state";

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

interface IChildTableRowProps {
    rowId: string;
    isVisible: boolean;
}

const ChildTableRow = ({ rowId, isVisible }: IChildTableRowProps) => {
    const openChildTable = useRecoilValue(openChildTableState);

    if (!isVisible || openChildTable.rowId !== rowId) {
        return null;
    }

    const renderInventoryTable = () => (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Inventory Details
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Supplier Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Purchase m² Price</TableCell>
                            <TableCell>Purchase Roll Price</TableCell>
                            <TableCell>Purchase Currency</TableCell>
                            <TableCell>Sale m² Price (Base)</TableCell>
                            <TableCell>Sale Roll Price (Base)</TableCell>
                            <TableCell>Sale Currency</TableCell>
                            <TableCell>Length Stock (m)</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Jobs</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockInventoryData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.supplierName}</TableCell>
                                <TableCell>{row.code}</TableCell>
                                <TableCell>{row.purchaseM2Price}</TableCell>
                                <TableCell>{row.purchaseRollPrice}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '16px',
                                            padding: '4px 8px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {row.purchaseCurrency}
                                    </Box>
                                </TableCell>
                                <TableCell>{row.saleM2Price}</TableCell>
                                <TableCell>{row.saleRollPrice}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '16px',
                                            padding: '4px 8px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {row.saleCurrency}
                                    </Box>
                                </TableCell>
                                <TableCell>{row.lengthStock}</TableCell>
                                <TableCell>{row.client}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        {row.jobs}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderPurchasePricingTable = () => (
        <Box sx={{ width: '100%', mt: 1 }}>
            <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Purchase Order m² Cost</TableCell>
                            <TableCell>Purchase Order Roll Cost</TableCell>
                            <TableCell>Currency</TableCell>
                            <TableCell>Supplying time (working Day)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPurchasePricingData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.purchaseOrderM2Cost}</TableCell>
                                <TableCell>{row.purchaseOrderRollCost}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '16px',
                                            padding: '4px 8px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {row.currency}
                                    </Box>
                                </TableCell>
                                <TableCell>{row.supplyingTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>
            {openChildTable.tableType === 'inventory' && renderInventoryTable()}
            {openChildTable.tableType === 'purchasePricing' && renderPurchasePricingTable()}
        </Box>
    );
};

export { ChildTableRow };
