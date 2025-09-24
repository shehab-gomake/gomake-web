import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, isLoadingInventoryState, isLoadingPurchasePricingState, openAddSupplierModalState, materialCategorySuppliersState } from "../../state";
import { useInventoryData } from "../../hooks/use-inventory-data";
import { usePurchasePricingData } from "../../hooks/use-purchase-pricing-data";
import { AddSupplierModal } from "../add-supplier/add-supplier-modal";
import { GomakeTextInput, GomakePrimaryButton, GoMakeDeleteModal } from "@/components";
import { useGomakeAxios } from "@/hooks";
import { updatePrintHouseMaterialPropApi, deletePrintHouseMaterialSupplierApi, addSupplierInventoryApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { TableCellData } from "../table-cell-data/table-cell";
import { ModalType } from "@/enums";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";


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
    const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRowForDelete, setSelectedRowForDelete] = useState<any>(null);
    const [formData, setFormData] = useState({
        supplierName: '',
        purchasePrice: '',
        currency: 'ILS',
        quantityInPackage: '',
        supplementTime: '',
        order: '',
        isActive: true
    });
    const [inventoryFormData, setInventoryFormData] = useState({
        printHouseMaterialId: '',
        supplierId: '',
        code: '',
        quantity: 0,
        inventory: 0,
        isActive: true,
        purchasePrice: 0,
        salePrice: 0,
        clients: []
    });
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

    const { inventoryData, fetchInventoryData, clearInventoryData } = useInventoryData();
    const { purchasePricingData, fetchPurchasePricingData, clearPurchasePricingData } = usePurchasePricingData();
    const { callApi } = useGomakeAxios();
    const materialCategorySuppliers = useRecoilValue(materialCategorySuppliersState);
    const { renderOptions, checkWhatRenderArray, isFetching } = useCustomerDropDownList({
        clientType: CLIENT_TYPE.SUPPLIER,
    });

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
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 3,
                    border: '1px dashed #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        No inventory data available,
                    </span>
                    <span
                        onClick={() => setIsAddInventoryModalOpen(true)}
                        style={{
                            fontSize: '14px',
                            color: '#1976d2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        add new?
                    </span>
                </Box>
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
                                <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventoryData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.supplierName || ''}
                                            isEditable={false}
                                            type={0}
                                            id={row.id}
                                            parameterKey="supplierName"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.code || ''}
                                            isEditable={true}
                                            type={0}
                                            id={row.id}
                                            parameterKey="code"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.purchasePrice?.["price Unit / ton"]?.value?.[0] || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="purchaseM2Price"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.purchasePrice?.["price Unit / ton"]?.value?.[1] || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="purchaseRollPrice"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.purchasePrice?.currency || 'USD'}
                                            isEditable={true}
                                            type={6}
                                            id={row.id}
                                            parameterKey="purchaseCurrency"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            values={[
                                                { key: 'ILS', value: 'ILS' },
                                                { key: 'USD', value: 'USD' },
                                                { key: 'EUR', value: 'EUR' }
                                            ]}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.salePrice?.["price Unit / ton"]?.value?.[0] || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="saleM2Price"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.salePrice?.["price Unit / ton"]?.value?.[1] || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="saleRollPrice"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={true}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.salePrice?.currency || 'USD'}
                                            isEditable={true}
                                            type={6}
                                            id={row.id}
                                            parameterKey="saleCurrency"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            values={[
                                                { key: 'ILS', value: 'ILS' },
                                                { key: 'USD', value: 'USD' },
                                                { key: 'EUR', value: 'EUR' }
                                            ]}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.lengthStock || row.length_stock || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{row.client || '—'}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => setIsAddInventoryModalOpen(true)}
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
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.supplierName || ''}
                                            isEditable={false}
                                            type={0}
                                            id={row.id}
                                            parameterKey="supplierName"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.purchasePrice?.amount || row.purchasePrice?.value || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="purchasePrice"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.purchasePrice?.currency || 'ILS'}
                                            isEditable={true}
                                            type={6}
                                            id={row.id}
                                            parameterKey="currency"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            values={[
                                                { key: 'ILS', value: 'ILS' },
                                                { key: 'USD', value: 'USD' },
                                                { key: 'EUR', value: 'EUR' }
                                            ]}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.quantityInPackage || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="quantityInPackage"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.supplementTime || ''}
                                            isEditable={true}
                                            type={1}
                                            id={row.id}
                                            parameterKey="supplementTime"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.order || ''}
                                            isEditable={true}
                                            type={0}
                                            id={row.id}
                                            parameterKey="order"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <TableCellData
                                            value={row.isActive ? 'Active' : 'Inactive'}
                                            isEditable={false}
                                            type={0}
                                            id={row.id}
                                            parameterKey="isActive"
                                            isAdmin={false}
                                            onChangeRowCheckBox={() => { }}
                                            isInventoryTable={false}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDeleteModal(row)}
                                                sx={{
                                                    color: '#f44336',
                                                    '&:hover': {
                                                        backgroundColor: '#ffebee'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
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

    const handleInventoryFormChange = (field: string, value: any) => {
        setInventoryFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCloseAddInventoryModal = () => {
        setIsAddInventoryModalOpen(false);
        setSelectedSupplier(null);
        setInventoryFormData({
            printHouseMaterialId: '',
            supplierId: '',
            code: '',
            quantity: 0,
            inventory: 0,
            isActive: true,
            purchasePrice: 0,
            salePrice: 0,
            clients: []
        });
    };

    const handleSupplierSelect = (e, supplier: any) => {
        setSelectedSupplier(supplier);
        handleInventoryFormChange('supplierId', supplier?.id || '');
    };

    const handleAddInventory = async () => {
        try {
            const inventoryData = {
                printHouseMaterialId: rowId,
                supplierId: inventoryFormData.supplierId,
                code: inventoryFormData.code,
                quantity: parseInt(inventoryFormData.quantity.toString()) || 0,
                inventory: parseInt(inventoryFormData.inventory.toString()) || 0,
                isActive: inventoryFormData.isActive,
                purchasePrice: parseFloat(inventoryFormData.purchasePrice.toString()) || 0,
                salePrice: parseFloat(inventoryFormData.salePrice.toString()) || 0,
                clients: inventoryFormData.clients
            };

            const callBack = (res) => {
                if (res.success) {
                    console.log('Inventory added successfully');
                    // Refresh the inventory data
                    fetchInventoryData(rowId);
                    handleCloseAddInventoryModal();
                } else {
                    console.error('Failed to add inventory:', res.message);
                }
            };

            await addSupplierInventoryApi(callApi, callBack, inventoryData);
        } catch (error) {
            console.error('Error adding inventory:', error);
        }
    };

    const handleOpenDeleteModal = (row: any) => {
        setSelectedRowForDelete(row);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedRowForDelete(null);
    };

    const handleDeletePurchasePricing = async () => {
        if (!selectedRowForDelete) return;

        try {
            const callBack = (res) => {
                if (res.success) {
                    console.log('Purchase pricing deleted successfully');
                    // Refresh the purchase pricing data
                    fetchPurchasePricingData(rowId);
                    handleCloseDeleteModal();
                } else {
                    console.error('Failed to delete purchase pricing:', res.message);
                }
            };

            await deletePrintHouseMaterialSupplierApi(callApi, callBack, selectedRowForDelete.id);
        } catch (error) {
            console.error('Error deleting purchase pricing:', error);
        }
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

            {/* Add Inventory Modal */}
            <Dialog
                open={isAddInventoryModalOpen}
                onClose={handleCloseAddInventoryModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add New Inventory</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#000' }}>Supplier</div>
                            <ClientAutocomplete
                                key={selectedSupplier?.id}
                                clientType={CLIENT_TYPE.SUPPLIER}
                                onChange={handleSupplierSelect}
                                options={renderOptions() ? renderOptions() : []}
                                placeholder="Select a supplier"
                                style={{ width: '100%' }}
                                value={selectedSupplier}
                                onChangeTextField={checkWhatRenderArray}
                                getOptionLabel={(option: any) => `${option.name}`}
                                loading={isFetching}
                            />
                        </Box>
                        <GomakeTextInput
                            labelText="Code"
                            value={inventoryFormData.code}
                            onChange={(e) => handleInventoryFormChange('code', e.target.value)}
                            placeholder="Enter code"
                        />
                        <GomakeTextInput
                            labelText="Quantity"
                            value={inventoryFormData.quantity.toString()}
                            onChange={(e) => handleInventoryFormChange('quantity', parseInt(e.target.value) || 0)}
                            type="number"
                            placeholder="Enter quantity"
                        />
                        <GomakeTextInput
                            labelText="Inventory"
                            value={inventoryFormData.inventory.toString()}
                            onChange={(e) => handleInventoryFormChange('inventory', parseInt(e.target.value) || 0)}
                            type="number"
                            placeholder="Enter inventory amount"
                        />
                        <GomakeTextInput
                            labelText="Purchase Price"
                            value={inventoryFormData.purchasePrice.toString()}
                            onChange={(e) => handleInventoryFormChange('purchasePrice', parseFloat(e.target.value) || 0)}
                            type="number"
                            placeholder="Enter purchase price"
                        />
                        <GomakeTextInput
                            labelText="Sale Price"
                            value={inventoryFormData.salePrice.toString()}
                            onChange={(e) => handleInventoryFormChange('salePrice', parseFloat(e.target.value) || 0)}
                            type="number"
                            placeholder="Enter sale price"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <GomakePrimaryButton
                        onClick={handleCloseAddInventoryModal}
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
                        onClick={handleAddInventory}
                        style={{ width: 'auto', padding: '8px 16px' }}
                    >
                        Add Inventory
                    </GomakePrimaryButton>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <GoMakeDeleteModal
                modalType={ModalType.DELETE}
                openModal={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onClickDelete={handleDeletePurchasePricing}
            />
        </Box>
    );
};

export { ChildTableRow };
