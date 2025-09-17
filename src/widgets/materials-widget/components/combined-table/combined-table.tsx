import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox } from "@mui/material";
import { useRecoilValue } from "recoil";
import { openChildTableState } from "../../state";
import { TableCellData } from "../table-cell-data/table-cell";
import { MaterialMenuWidget } from "../more-circle";
import { useTranslation } from "react-i18next";

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

interface ICombinedTableProps {
    headers: any[];
    rows: any[];
    isAdmin: boolean;
    onChangeRowCheckBox: (id: string, checked: boolean) => void;
    onClickOpenDeleteTableRowModal: (dataRow: any) => void;
    onClickOpenDeleteTableRowWhenHaveMoreSupplierModal: (dataRow: any) => void;
    toggleIsActive: (id: string, parameterKey: string, value: boolean) => void;
}

const CombinedTable = ({
    headers,
    rows,
    isAdmin,
    onChangeRowCheckBox,
    onClickOpenDeleteTableRowModal,
    onClickOpenDeleteTableRowWhenHaveMoreSupplierModal,
    toggleIsActive
}: ICombinedTableProps) => {
    const { t } = useTranslation();
    const openChildTable = useRecoilValue(openChildTableState);

    const renderInventoryTable = () => (
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
    );

    const renderPurchasePricingTable = () => (
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
    );

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableCell key={index}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            <TableRow>
                                {row.cells.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                            </TableRow>
                            {/* Check if this row has an open child table */}
                            {openChildTable.rowId === row.id && (
                                <TableRow>
                                    <TableCell colSpan={headers.length} sx={{ padding: 0, border: 'none' }}>
                                        <Box sx={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                                            {openChildTable.tableType === 'inventory' && renderInventoryTable()}
                                            {openChildTable.tableType === 'purchasePricing' && renderPurchasePricingTable()}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export { CombinedTable };
