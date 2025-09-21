import React, { useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { useRecoilValue } from "recoil";
import { openChildTableState, isLoadingInventoryState, isLoadingPurchasePricingState } from "../../state";
import { useInventoryData } from "../../hooks/use-inventory-data";
import { usePurchasePricingData } from "../../hooks/use-purchase-pricing-data";


interface IChildTableRowProps {
    rowId: string;
    isVisible: boolean;
}

const ChildTableRow = ({ rowId, isVisible }: IChildTableRowProps) => {
    const openChildTable = useRecoilValue(openChildTableState);
    const isLoadingInventory = useRecoilValue(isLoadingInventoryState);
    const isLoadingPurchasePricing = useRecoilValue(isLoadingPurchasePricingState);

    const { inventoryData, fetchInventoryData, clearInventoryData } = useInventoryData();
    const { purchasePricingData, fetchPurchasePricingData, clearPurchasePricingData } = usePurchasePricingData();

    useEffect(() => {
        if (isVisible && openChildTable.rowId === rowId && rowId) {
            if (openChildTable.tableType === 'inventory') {
                fetchInventoryData(rowId);
            } else if (openChildTable.tableType === 'purchasePricing') {
                fetchPurchasePricingData(rowId);
            }
        } else {
            // Clear data when closing or switching tables
            clearInventoryData();
            clearPurchasePricingData();
        }
    }, [isVisible, openChildTable.rowId, openChildTable.tableType, rowId]);

    if (!isVisible || openChildTable.rowId !== rowId) {
        return null;
    }

    const renderInventoryTable = () => (
        <Box sx={{ width: '100%', mt: 1 }}>
            {isLoadingInventory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : inventoryData.length === 0 ? (
                <Alert severity="info">No inventory data available</Alert>
            ) : (
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
                            {inventoryData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.supplierName || row.supplier_name || '—'}</TableCell>
                                    <TableCell>{row.code || '—'}</TableCell>
                                    <TableCell>{row.purchaseM2Price || row.purchase_m2_price || '—'}</TableCell>
                                    <TableCell>{row.purchaseRollPrice || row.purchase_roll_price || '—'}</TableCell>
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
                                            {row.purchaseCurrency || row.purchase_currency || '—'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.saleM2Price || row.sale_m2_price || '—'}</TableCell>
                                    <TableCell>{row.saleRollPrice || row.sale_roll_price || '—'}</TableCell>
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
                                            {row.saleCurrency || row.sale_currency || '—'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.lengthStock || row.length_stock || '—'}</TableCell>
                                    <TableCell>{row.client || '—'}</TableCell>
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
                                            {row.jobs || 'Show'}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    const renderPurchasePricingTable = () => (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Purchase Pricing Details
            </Typography>

            {isLoadingPurchasePricing ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : purchasePricingData.length === 0 ? (
                <Alert severity="info">No purchase pricing data available</Alert>
            ) : (
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
                            {purchasePricingData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.purchaseOrderM2Cost || row.purchase_order_m2_cost || '—'}</TableCell>
                                    <TableCell>{row.purchaseOrderRollCost || row.purchase_order_roll_cost || '—'}</TableCell>
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
                                            {row.currency || '—'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{row.supplyingTime || row.supplying_time || '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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
