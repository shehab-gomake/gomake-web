import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, isLoadingInventoryState, isLoadingPurchasePricingState, openAddSupplierModalState } from "../../state";
import { useInventoryData } from "../../hooks/use-inventory-data";
import { usePurchasePricingData } from "../../hooks/use-purchase-pricing-data";
import { AddSupplierModal } from "../add-supplier/add-supplier-modal";
import { GomakeTextInput, GomakePrimaryButton } from "@/components";


interface IChildTableRowProps {
    rowId: string;
    isVisible: boolean;
}

const ChildTableRow = ({ rowId, isVisible }: IChildTableRowProps) => {
    const openChildTable = useRecoilValue(openChildTableState);
    const isLoadingInventory = useRecoilValue(isLoadingInventoryState);
    const isLoadingPurchasePricing = useRecoilValue(isLoadingPurchasePricingState);
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
    const [isAddPurchasePricingModalOpen, setIsAddPurchasePricingModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        supplierName: '',
        purchasePrice: '',
        currency: 'ILS',
        quantityInPackage: '',
        supplementTime: '',
        order: '',
        isActive: true
    });

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
                                <TableCell sx={{ textAlign: 'center' }}>Supplier Name</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Code</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Purchase m² Price</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Purchase Roll Price</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Purchase Currency</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Sale m² Price (Base)</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Sale Roll Price (Base)</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Sale Currency</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Length Stock (m)</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Client</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventoryData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.supplierName || row.supplier_name || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.code || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.purchaseM2Price || row.purchase_m2_price || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.purchaseRollPrice || row.purchase_roll_price || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
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
                                    <TableCell sx={{ textAlign: 'center' }}>{row.saleM2Price || row.sale_m2_price || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.saleRollPrice || row.sale_roll_price || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
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
                                    <TableCell sx={{ textAlign: 'center' }}>{row.lengthStock || row.length_stock || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.client || '—'}</TableCell>
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
                                <TableCell sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        Supplier Name
                                        <IconButton
                                            size="small"
                                            onClick={() => setOpenAddSupplierModal(true)}
                                            sx={{
                                                color: '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd'
                                                }
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Purchase Price</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Currency</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Quantity in Package</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Supplement Time</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Order</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Status</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Existing data rows */}
                            {purchasePricingData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.supplierName || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {row.purchasePrice?.amount || row.purchasePrice?.value || '—'}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: '16px',
                                                padding: '4px 8px',
                                                display: 'inline-block',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {row.purchasePrice?.currency || '—'}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.quantityInPackage || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.supplementTime || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.order || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                backgroundColor: row.isActive ? '#e8f5e8' : '#ffe8e8',
                                                color: row.isActive ? '#2e7d32' : '#d32f2f',
                                                borderRadius: '16px',
                                                padding: '4px 8px',
                                                display: 'inline-block',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {row.isActive ? 'Active' : 'Inactive'}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => setIsAddPurchasePricingModalOpen(true)}
                                            sx={{
                                                color: '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd'
                                                }
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );

    const handleCloseAddPurchasePricingModal = () => {
        setIsAddPurchasePricingModalOpen(false);
        setFormData({
            supplierName: '',
            purchasePrice: '',
            currency: 'ILS',
            quantityInPackage: '',
            supplementTime: '',
            order: '',
            isActive: true
        });
    };

    const handleAddPurchasePricing = () => {
        // TODO: Implement add purchase pricing functionality
        console.log('Add purchase pricing clicked with data:', formData);
        handleCloseAddPurchasePricingModal();
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Box sx={{ width: '100%', gridColumn: '1 / -1' }}>
            {openChildTable.tableType === 'inventory' && renderInventoryTable()}
            {openChildTable.tableType === 'purchasePricing' && renderPurchasePricingTable()}

            {/* Use existing AddSupplierModal */}
            <AddSupplierModal />

            {/* Add Purchase Pricing Modal */}
            <Dialog
                open={isAddPurchasePricingModalOpen}
                onClose={handleCloseAddPurchasePricingModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Purchase Pricing</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <GomakeTextInput
                            labelText="Supplier Name"
                            value={formData.supplierName}
                            onChange={(e) => handleFormChange('supplierName', e.target.value)}
                            placeholder="Enter supplier name"
                        />
                        <GomakeTextInput
                            labelText="Purchase Price"
                            value={formData.purchasePrice}
                            onChange={(e) => handleFormChange('purchasePrice', e.target.value)}
                            type="number"
                            placeholder="Enter purchase price"
                        />
                        <Box>
                            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#000' }}>Currency</div>
                            <select
                                value={formData.currency}
                                onChange={(e) => handleFormChange('currency', e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '37px',
                                    padding: '0 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="ILS">ILS</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </Box>
                        <GomakeTextInput
                            labelText="Quantity in Package"
                            value={formData.quantityInPackage}
                            onChange={(e) => handleFormChange('quantityInPackage', e.target.value)}
                            type="number"
                            placeholder="Enter quantity"
                        />
                        <GomakeTextInput
                            labelText="Supplement Time (days)"
                            value={formData.supplementTime}
                            onChange={(e) => handleFormChange('supplementTime', e.target.value)}
                            type="number"
                            placeholder="Enter supplement time"
                        />
                        <GomakeTextInput
                            labelText="Order"
                            value={formData.order}
                            onChange={(e) => handleFormChange('order', e.target.value)}
                            placeholder="Enter order number"
                        />
                        <Box>
                            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#000' }}>Status</div>
                            <select
                                value={formData.isActive ? 'true' : 'false'}
                                onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
                                style={{
                                    width: '100%',
                                    height: '37px',
                                    padding: '0 12px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <GomakePrimaryButton
                        onClick={handleCloseAddPurchasePricingModal}
                        style={{
                            backgroundColor: '#f5f5f5',
                            color: '#666',
                            marginRight: '8px',
                            width: 'auto',
                            padding: '8px 16px'
                        }}
                    >
                        Cancel
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={handleAddPurchasePricing}
                        style={{ width: 'auto', padding: '8px 16px' }}
                    >
                        Add Purchase Pricing
                    </GomakePrimaryButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export { ChildTableRow };
