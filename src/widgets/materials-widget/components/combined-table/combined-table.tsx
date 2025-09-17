import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox } from "@mui/material";
import { useRecoilValue } from "recoil";
import { openChildTableState } from "../../state";
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
            <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#EBECFF' }}>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Supplier Name</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Code</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Purchase m² Price</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Purchase Roll Price</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Purchase Currency</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Sale m² Price (Base)</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Sale Roll Price (Base)</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Sale Currency</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Length Stock (m)</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Client</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Jobs</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockInventoryData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.supplierName}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.code}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.purchaseM2Price}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.purchaseRollPrice}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
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
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.saleM2Price}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.saleRollPrice}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
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
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.lengthStock}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.client}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
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
            <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#EBECFF' }}>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Purchase Order m² Cost</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Purchase Order Roll Cost</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Currency</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>Supplying time (working Day)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mockPurchasePricingData.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.purchaseOrderM2Cost}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.purchaseOrderRollCost}</TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
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
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{row.supplyingTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 750, width: '100%' }}>
            <Table sx={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#EBECFF' }}>
                        {headers.map((header, index) => (
                            <TableCell
                                key={index}
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    padding: '12px 8px',
                                    backgroundColor: '#EBECFF'
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            <TableRow>
                                {row.cells.map((cell, cellIndex) => (
                                    <TableCell
                                        key={cellIndex}
                                        sx={{
                                            textAlign: 'center',
                                            padding: '12px 8px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cell}
                                    </TableCell>
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
