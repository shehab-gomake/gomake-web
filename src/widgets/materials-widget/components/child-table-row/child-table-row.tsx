import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, isLoadingInventoryState, isLoadingPurchasePricingState, openAddSupplierModalState, materialCategorySuppliersState, openJobsModalState } from "../../state";
import { useInventoryData } from "../../hooks/use-inventory-data";
import { usePurchasePricingData } from "../../hooks/use-purchase-pricing-data";
import { AddSupplierModal } from "../add-supplier/add-supplier-modal";
import { GomakeTextInput, GomakePrimaryButton, GoMakeDeleteModal } from "@/components";
import { useGomakeAxios } from "@/hooks";
import { deletePrintHouseMaterialSupplierApi, addSupplierInventoryApi, deleteSupplierInventoryApi, reorderPrintHouseMaterialSupplierApi, getSupplierInventoryUsageApi, reorderPrintHouseSupplierInventoriesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { TableCellData } from "../table-cell-data/table-cell";
import { ModalType } from "@/enums";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStyle } from "./style";
import { SortIcon } from "@/icons";
import { JobsModal } from "../jobs-modal/jobs-modal";


interface IChildTableRowProps {
    rowId: string;
    isVisible: boolean;
    renderOptions: any;
    checkWhatRenderArray: any;
    isFetching: boolean;
    materialType?: string;
    materialCategory?: string;
}

const ChildTableRow = ({ rowId, isVisible, renderOptions, checkWhatRenderArray, isFetching, materialType, materialCategory }: IChildTableRowProps) => {
    const { classes } = useStyle();
    const openChildTable = useRecoilValue(openChildTableState);
    const isLoadingInventory = useRecoilValue(isLoadingInventoryState);
    const isLoadingPurchasePricing = useRecoilValue(isLoadingPurchasePricingState);
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
    const jobsModal = useRecoilValue(openJobsModalState);
    const setJobsModal = useSetRecoilState(openJobsModalState);
    const [isAddPurchasePricingModalOpen, setIsAddPurchasePricingModalOpen] = useState(false);
    const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRowForDelete, setSelectedRowForDelete] = useState<any>(null);
    const [jobsData, setJobsData] = useState<any[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [formData, setFormData] = useState({
        supplierId: '',
        purchaseM2Price: '',
        purchaseRollPrice: '',
        currency: 'ILS',
        quantityInPackage: '',
        supplementTime: '',
        order: '',
        isActive: true
    });
    const [selectedSupplierForPricing, setSelectedSupplierForPricing] = useState<any>(null);
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

    const { inventoryData, inventoryTableHeadingUnits, fetchInventoryData, clearInventoryData } = useInventoryData();
    const { purchasePricingData, purchasePricingTableHeadingUnits, fetchPurchasePricingData, clearPurchasePricingData } = usePurchasePricingData();
    const { callApi } = useGomakeAxios();


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

    // Drag and drop handlers
    const handleInventoryDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) {
            return;
        }

        // Reorder inventory data locally
        const reorderedData = Array.from(inventoryData);
        const [removed] = reorderedData.splice(sourceIndex, 1);
        reorderedData.splice(destinationIndex, 0, removed);

        // Update local state (you might need to implement this in the hook)
        // For now, we'll just call the API and refetch

        try {
            // Format data according to API specification
            const reorderData = {
                printHouseMaterialId: rowId,
                inventories: reorderedData.map((item, index) => ({
                    printHouseMaterialSupplierInventoryId: item.id,
                    order: index
                }))
            };

            const callBack = (res) => {
                if (res.success) {
                    console.log('Inventory reordered successfully');
                    // Refetch data to get updated order
                    fetchInventoryData(rowId);
                } else {
                    console.error('Failed to reorder inventory:', res.message);
                }
            };

            await reorderPrintHouseSupplierInventoriesApi(callApi, callBack, reorderData);
        } catch (error) {
            console.error('Error reordering inventory:', error);
        }
    };

    const handlePurchasePricingDragEnd = async (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) {
            return;
        }

        // Reorder purchase pricing data locally
        const reorderedData = Array.from(purchasePricingData);
        const [removed] = reorderedData.splice(sourceIndex, 1);
        reorderedData.splice(destinationIndex, 0, removed);

        try {
            // Format data according to API specification
            const reorderData = {
                materialTypeKey: materialType,
                categoryKey: materialCategory,
                suppliers: reorderedData.map((item, index) => ({
                    printHouseMaterialSupplierId: item.id,
                    order: index
                }))
            };

            const callBack = (res) => {
                if (res.success) {
                    console.log('Purchase pricing reordered successfully');
                    // Refetch data to get updated order
                    fetchPurchasePricingData(rowId);
                } else {
                    console.error('Failed to reorder purchase pricing:', res.message);
                }
            };

            await reorderPrintHouseMaterialSupplierApi(callApi, callBack, reorderData);
        } catch (error) {
            console.error('Error reordering purchase pricing:', error);
        }
    };

    const handleOpenJobsModal = async (supplierName: string, materialCode: string, materialName: string = "m1", supplierInventoryId?: string) => {
        // Open modal first
        setJobsModal({
            open: true,
            supplierName,
            materialCode,
            materialName
        });

        // Fetch jobs data if we have a supplier inventory ID
        if (supplierInventoryId) {
            setIsLoadingJobs(true);
            setJobsData([]);

            try {
                const callBack = (res) => {
                    setIsLoadingJobs(false);
                    if (res.success) {
                        setJobsData(res.data || []);
                    } else {
                        console.error('Failed to fetch jobs data:', res.message);
                        setJobsData([]);
                    }
                };

                await getSupplierInventoryUsageApi(callApi, callBack, supplierInventoryId);
            } catch (error) {
                console.error('Error fetching jobs data:', error);
                setIsLoadingJobs(false);
                setJobsData([]);
            }
        } else {
            // No supplier inventory ID, use empty data
            setJobsData([]);
            setIsLoadingJobs(false);
        }
    };

    const handleCloseJobsModal = () => {
        setJobsModal({ open: false });
    };

    const renderInventoryTable = () => (
        <Box sx={classes.childTableContainer}>
            {isLoadingInventory ? (
                <Box sx={classes.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : inventoryData.length === 0 ? (
                <Box sx={classes.noDataContainer}>
                    <span style={classes.noDataText}>
                        No inventory data available,
                    </span>
                    <span
                        onClick={() => setIsAddInventoryModalOpen(true)}
                        style={classes.noDataLink}
                    >
                        add new?
                    </span>
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={classes.tableContainer}
                >
                    <DragDropContext onDragEnd={handleInventoryDragEnd}>
                        <Table sx={classes.table} stickyHeader>
                            <TableHead>
                                <TableRow sx={classes.headerRow}>
                                    {/* Add drag handle header */}
                                    <TableCell sx={classes.headerCell}></TableCell>
                                    <TableCell sx={classes.headerCell}>Supplier Name

                                        <IconButton
                                            size="small"
                                            onClick={() => setIsAddInventoryModalOpen(true)}
                                            sx={classes.actionButton}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>Code</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        Purchase Price ({inventoryTableHeadingUnits.pricingUnit})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>Purchase Currency</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        Sale Cost ({inventoryTableHeadingUnits.pricingUnit})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>Sale Currency</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        Inventory ({inventoryTableHeadingUnits.inventoryUnit})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        Quantity ({inventoryTableHeadingUnits.inventoryUnit})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>Status</TableCell>
                                    <TableCell sx={classes.headerCell}>Client</TableCell>
                                    <TableCell sx={classes.headerCell}>Jobs</TableCell>
                                    <TableCell sx={classes.headerCell}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <Droppable droppableId="inventory-rows">
                                {(provided) => (
                                    <TableBody
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {inventoryData.map((row, index) => (
                                            <Draggable key={row.id || `inventory-${index}`} draggableId={row.id || `inventory-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        sx={{
                                                            ...classes.bodyRow,
                                                            ...(snapshot.isDragging && classes.draggingRow)
                                                        }}
                                                    >
                                                        {/* Drag handle cell */}
                                                        <TableCell
                                                            {...provided.dragHandleProps}
                                                            sx={classes.dragHandleCell}
                                                        >
                                                            <SortIcon />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
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
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.code || ''}
                                                                isEditable={true}
                                                                type={0}
                                                                id={row.id}
                                                                parameterKey="sku"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={[
                                                                    row.purchasePrice?.perUnit?.toString() || '',
                                                                    row.purchasePrice?.perTon?.toString() || ''
                                                                ]}
                                                                isEditable={true}
                                                                type={3}
                                                                id={row.id}
                                                                parameterKey="purchasePrice"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.purchasePrice?.currency?.toLowerCase() || 'usd'}
                                                                isEditable={true}
                                                                type={5}
                                                                id={row.id}
                                                                parameterKey="currency"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={[
                                                                    row.salePrice?.perUnit?.toString() || '',
                                                                    row.salePrice?.perTon?.toString() || ''
                                                                ]}
                                                                isEditable={true}
                                                                type={3}
                                                                id={row.id}
                                                                parameterKey="salePrice"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.salePrice?.currency?.toLowerCase() || 'usd'}
                                                                isEditable={true}
                                                                type={5}
                                                                id={row.id}
                                                                parameterKey="saleCurrency"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.inventory || ''}
                                                                isEditable={true}
                                                                type={1}
                                                                id={row.id}
                                                                parameterKey="inventory"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.quantity}
                                                                isEditable={true}
                                                                type={1}
                                                                id={row.id}
                                                                parameterKey="quantity"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.isActive}
                                                                isEditable={true}
                                                                type={2}
                                                                id={row.id}
                                                                parameterKey="isActive"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={classes.bodyCell} className="fixed-column">{row.client || '—'}</TableCell>
                                                        <TableCell sx={classes.bodyCell} className="fixed-column">
                                                            <Box
                                                                onClick={() => handleOpenJobsModal(row.supplierName, row.code, materialType, row.id)}
                                                                sx={{
                                                                    padding: '6px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #ccc',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: 'transparent',
                                                                    fontSize: '12px',
                                                                    fontWeight: '500',
                                                                    color: '#000',
                                                                    textAlign: 'center',
                                                                    minWidth: '50px',
                                                                    display: 'inline-block',
                                                                    '&:hover': {
                                                                        backgroundColor: '#f5f5f5',
                                                                        color: '#1565c0'
                                                                    },
                                                                    transition: 'all 0.2s ease-in-out'
                                                                }}
                                                            >
                                                                Show
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell} className="fixed-column">

                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDeleteInventoryModal(row)}
                                                                sx={classes.deleteButton}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                )}
                            </Droppable>
                        </Table>
                    </DragDropContext>
                </TableContainer>
            )}
        </Box>
    );

    const renderPurchasePricingTable = () => (
        <Box sx={classes.childTableContainer}>
            {isLoadingPurchasePricing ? (
                <Box sx={classes.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : purchasePricingData.length === 0 ? (
                <Alert severity="info">No purchase pricing data available</Alert>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        ...classes.tableContainer,
                    }}
                >
                    <DragDropContext onDragEnd={handlePurchasePricingDragEnd}>
                        <Table sx={classes.table} stickyHeader>
                            <TableHead>
                                <TableRow sx={classes.headerRow}>
                                    {/* Add drag handle header */}
                                    <TableCell sx={classes.headerCell} ></TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        <Box sx={classes.headerButtonContainer}>
                                            Supplier Name
                                            <IconButton
                                                size="small"
                                                onClick={() => setIsAddPurchasePricingModalOpen(true)}
                                                sx={classes.addButton}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        Purchase Price ({purchasePricingTableHeadingUnits.pricingUnit})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>Currency</TableCell>
                                    <TableCell sx={classes.headerCell}>Quantity in Package ({purchasePricingTableHeadingUnits.inventoryUnit})</TableCell>
                                    <TableCell sx={classes.headerCell}>Supplement Time (working days)</TableCell>
                                    <TableCell sx={classes.headerCell}>Status</TableCell>
                                    <TableCell sx={classes.headerCell}>Client</TableCell>
                                    <TableCell sx={classes.headerCell}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <Droppable droppableId="purchase-pricing-rows">
                                {(provided) => (
                                    <TableBody
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {/* Existing data rows */}
                                        {purchasePricingData.map((row, index) => (
                                            <Draggable key={row.id || `pricing-${index}`} draggableId={row.id || `pricing-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        sx={{
                                                            ...classes.bodyRow,
                                                            ...(snapshot.isDragging && classes.draggingRow)
                                                        }}
                                                    >
                                                        {/* Drag handle cell */}
                                                        <TableCell
                                                            {...provided.dragHandleProps}
                                                            sx={classes.dragHandleCell}
                                                        >
                                                            <SortIcon />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.supplierName || ''}
                                                                isEditable={false}
                                                                type={0}
                                                                id={row.id}
                                                                parameterKey="supplierName"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={[
                                                                    row.purchasePrice?.["price Unit / ton"]?.value?.[0] || '',
                                                                    row.purchasePrice?.["price Unit / ton"]?.value?.[1] || ''
                                                                ]}
                                                                isEditable={true}
                                                                type={3}
                                                                id={row.id}
                                                                parameterKey="price Unit / ton"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.purchasePrice?.currency || 'ILS'}
                                                                isEditable={true}
                                                                type={5}
                                                                id={row.id}
                                                                parameterKey="currency"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.quantityInPackage || ''}
                                                                isEditable={true}
                                                                type={1}
                                                                id={row.id}
                                                                parameterKey="quantityInPackage"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.supplementTime || ''}
                                                                isEditable={true}
                                                                type={1}
                                                                id={row.id}
                                                                parameterKey="supplementTime"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={classes.bodyCell} className="fixed-column">
                                                            <TableCellData
                                                                value={row.isActive}
                                                                isEditable={true}
                                                                type={2}
                                                                id={row.id}
                                                                parameterKey="isActive"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isPurchasePricingTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell} className="fixed-column">{row.client || '—'}</TableCell>
                                                        <TableCell sx={classes.bodyCell} className="fixed-column">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDeleteModal(row)}
                                                                sx={classes.deleteButton}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                )}
                            </Droppable>
                        </Table>
                    </DragDropContext>
                </TableContainer>
            )}
        </Box>
    );

    const handleCloseAddPurchasePricingModal = () => {
        setIsAddPurchasePricingModalOpen(false);
        setSelectedSupplierForPricing(null);
        setFormData({
            supplierId: '',
            purchaseM2Price: '',
            purchaseRollPrice: '',
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

    const handleSupplierSelectForPricing = (e, supplier: any) => {
        setSelectedSupplierForPricing(supplier);
        handleFormChange('supplierId', supplier?.id || '');
    };

    const handleAddInventory = async () => {
        try {
            const inventoryData = {
                printHouseMaterialId: rowId,
                supplierId: inventoryFormData.supplierId,
                code: inventoryFormData.code,
                quantity: parseInt(inventoryFormData.quantity.toString()) || 0,
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

    const handleOpenDeleteInventoryModal = (row: any) => {
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

    const handleDeleteInventory = async () => {
        if (!selectedRowForDelete) return;

        try {
            const callBack = (res) => {
                if (res.success) {
                    console.log('Inventory deleted successfully');
                    // Refresh the inventory data
                    fetchInventoryData(rowId);
                    handleCloseDeleteModal();
                } else {
                    console.error('Failed to delete inventory:', res.message);
                }
            };

            await deleteSupplierInventoryApi(callApi, callBack, selectedRowForDelete.id);
        } catch (error) {
            console.error('Error deleting inventory:', error);
        }
    };

    return (
        <Box sx={classes.mainContainer}>
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
                    <Box sx={classes.modalContent}>
                        <Box>
                            <div style={classes.modalLabelText}>Supplier</div>
                            <ClientAutocomplete
                                key={selectedSupplierForPricing?.id}
                                clientType={CLIENT_TYPE.SUPPLIER}
                                onChange={handleSupplierSelectForPricing}
                                options={renderOptions() ? renderOptions() : []}
                                placeholder="Select a supplier"
                                style={{ width: '100%' }}
                                value={selectedSupplierForPricing}
                                onChangeTextField={checkWhatRenderArray}
                                getOptionLabel={(option: any) => `${option.name}`}
                                loading={isFetching}
                            />
                        </Box>
                        <GomakeTextInput
                            labelText="Purchase m² Price"
                            value={formData.purchaseM2Price}
                            onChange={(e) => handleFormChange('purchaseM2Price', e.target.value)}
                            type="number"
                            placeholder="Enter purchase m² price"
                        />
                        <GomakeTextInput
                            labelText="Purchase Roll Price"
                            value={formData.purchaseRollPrice}
                            onChange={(e) => handleFormChange('purchaseRollPrice', e.target.value)}
                            type="number"
                            placeholder="Enter purchase roll price"
                        />
                        <Box>
                            <div style={classes.modalLabelText}>Currency</div>
                            <select
                                value={formData.currency}
                                onChange={(e) => handleFormChange('currency', e.target.value)}
                                style={classes.modalSelect}
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
                    </Box>
                </DialogContent>
                <DialogActions sx={classes.modalActions}>
                    <GomakePrimaryButton
                        onClick={handleCloseAddPurchasePricingModal}
                        style={classes.modalCancelButton}
                    >
                        Cancel
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={handleAddPurchasePricing}
                        style={classes.modalSubmitButton}
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
                    <Box sx={classes.modalContent}>
                        <Box>
                            <div style={classes.modalLabelText}>Supplier</div>
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
                <DialogActions sx={classes.modalActions}>
                    <GomakePrimaryButton
                        onClick={handleCloseAddInventoryModal}
                        style={classes.modalCancelButton}
                    >
                        Cancel
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={handleAddInventory}
                        style={classes.modalSubmitButton}
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
                onClickDelete={openChildTable.tableType === 'inventory' ? handleDeleteInventory : handleDeletePurchasePricing}
            />

            {/* Jobs Modal */}
            <JobsModal
                open={jobsModal.open}
                onClose={handleCloseJobsModal}
                supplierName={jobsModal.supplierName}
                materialCode={jobsModal.materialCode}
                materialName={jobsModal.materialName}
                jobsData={jobsData}
                isLoading={isLoadingJobs}
            />
        </Box>
    );
};

export { ChildTableRow };
