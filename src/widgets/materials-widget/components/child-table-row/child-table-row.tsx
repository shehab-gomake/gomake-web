import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, Tooltip } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { openChildTableState, isLoadingInventoryState, isLoadingPurchasePricingState, openJobsModalState, materialCategoryDataState } from "../../state";
import { useInventoryData } from "../../hooks/use-inventory-data";
import { usePurchasePricingData } from "../../hooks/use-purchase-pricing-data";
import { AddSupplierModal } from "../add-supplier/add-supplier-modal";
import { GomakePrimaryButton, GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { deletePrintHouseMaterialSupplierApi, addSupplierInventoryApi, deleteSupplierInventoryApi, reorderPrintHouseMaterialSupplierApi, getSupplierInventoryUsageApi, reorderPrintHouseSupplierInventoriesApi, addPrintHouseMaterialSupplierApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { TableCellData } from "../table-cell-data/table-cell";
import { ModalType, UNIT_TYPE } from "@/enums";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStyle } from "./style";
import { SortIcon } from "@/icons";
import { JobsModal } from "../jobs-modal/jobs-modal";
import { ExistingSupplierActionEnum } from "../../enums";
import { useTranslation } from "react-i18next";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { AddPurchasePricingModal } from "../add-purchase-pricing-modal/add-purchase-pricing-modal";
import { AddInventoryModal } from "../add-inventory-modal/add-inventory-modal";
import { userState } from "@/store/user";
import { convertTitleUnits } from "@/utils/helpers";


interface IChildTableRowProps {
    rowId: string;
    isVisible: boolean;
    materialType?: string;
    materialCategory?: string;
    renderOptionsCustomer?: any;
    checkWhatRenderArrayCustomer?: any;
    isFetchingCustomer?: boolean;
    renderOptionsSupplier?: any;
    checkWhatRenderArraySupplier?: any;
    isFetchingSupplier?: boolean;
}

const ChildTableRow = ({ rowId, isVisible, materialType, materialCategory, renderOptionsCustomer, checkWhatRenderArrayCustomer, isFetchingCustomer, renderOptionsSupplier, checkWhatRenderArraySupplier, isFetchingSupplier }: IChildTableRowProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const { alertFaultAdded, alertFault, alertRequiredFields } = useSnackBar();
    const openChildTable = useRecoilValue(openChildTableState);
    const isLoadingInventory = useRecoilValue(isLoadingInventoryState);
    const isLoadingPurchasePricing = useRecoilValue(isLoadingPurchasePricingState);
    const jobsModal = useRecoilValue(openJobsModalState);
    const setJobsModal = useSetRecoilState(openJobsModalState);
    const [isAddPurchasePricingModalOpen, setIsAddPurchasePricingModalOpen] = useState(false);
    const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRowForDelete, setSelectedRowForDelete] = useState<any>(null);
    const [isExistingSupplierModalOpen, setIsExistingSupplierModalOpen] = useState(false);
    const [pendingPurchasePricingData, setPendingPurchasePricingData] = useState<any>(null);
    const [jobsData, setJobsData] = useState<any[]>([]);
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);

    const [scrollLeft, setScrollLeft] = useState(0);
    const [formData, setFormData] = useState({
        supplierId: '',
        purchasePrice: '',
        currency: { value: '', label: '' },
        quantityInPackage: '',
        supplementTime: '',
        order: '',
        isActive: true,
        clients: []
    });
    const [openSupplierModal, setOpenSupplierModal] = useState(false);
    const [supplier, setSupplier] = useState<any>([]);

    const onSupplierAdd = (supplier) => {
        setOpenSupplierModal(false);
    };
    const onCloseSupplierModal = () => {
        setOpenSupplierModal(false);
    };

    const [selectedSupplierForPricing, setSelectedSupplierForPricing] = useState<any>(null);
    const [inventoryFormData, setInventoryFormData] = useState({
        printHouseMaterialId: '',
        supplierId: '',
        code: '',
        quantity: null,
        inventory: null,
        isActive: true,
        purchasePrice: null,
        salePrice: null,
        clients: [],
        purchaseCurrency: { value: '', label: '' },
        saleCurrency: { value: '', label: '' },
    });
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [selectedClients, setSelectedClients] = useState<any[]>([]);
    const [selectedClientsForPricing, setSelectedClientsForPricing] = useState<any[]>([]);

    const { inventoryData, inventoryTableHeadingUnits, fetchInventoryData, clearInventoryData, updateInventoryDataOrder, removeInventoryDataItem, updateInventoryDataItem } = useInventoryData();
    const { purchasePricingData, purchasePricingTableHeadingUnits, fetchPurchasePricingData, clearPurchasePricingData, updatePurchasePricingDataOrder, removePurchasePricingDataItem, updatePurchasePricingDataItem } = usePurchasePricingData();
    const convertedPricingUnit = inventoryTableHeadingUnits.pricingUnit;
    const convertedInventoryUnit = inventoryTableHeadingUnits.inventoryUnit;
    const convertedPurchasePricingUnit = purchasePricingTableHeadingUnits.pricingUnit;
    const convertedPurchasePricingInventoryUnit = purchasePricingTableHeadingUnits.inventoryUnit;

    const { callApi } = useGomakeAxios();
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState(materialCategoryDataState);

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

    // Track main table scroll position
    useEffect(() => {
        const handleMainTableScroll = () => {
            // Find the main table container
            const mainTableContainer = document.querySelector('.MuiTableContainer-root');
            if (mainTableContainer) {
                const newScrollLeft = mainTableContainer.scrollLeft;
                setScrollLeft(newScrollLeft);
                console.log('Main table scroll position:', newScrollLeft);
                console.log('Column positions will be:', {
                    column1: `${isRTL ? 'right' : 'left'}: ${newScrollLeft}px`,
                    column2: `${isRTL ? 'right' : 'left'}: ${newScrollLeft + 50}px`,
                    isRTL: isRTL
                });
            }
        };

        // Listen for scroll events on main table
        const mainTableContainer = document.querySelector('.MuiTableContainer-root');
        if (mainTableContainer && isVisible && openChildTable.rowId === rowId) {
            mainTableContainer.addEventListener('scroll', handleMainTableScroll);
            // Initial position
            handleMainTableScroll();

            return () => {
                mainTableContainer.removeEventListener('scroll', handleMainTableScroll);
            };
        }
    }, [isVisible, openChildTable.rowId, rowId]);

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

        // Update local state immediately for better UX
        updateInventoryDataOrder(reorderedData);

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
                    // No need to refetch - local state already updated
                } else {
                    console.error('Failed to reorder inventory:', res.message);
                    // Revert local state on error by refetching
                    fetchInventoryData(rowId);
                }
            };

            await reorderPrintHouseSupplierInventoriesApi(callApi, callBack, reorderData);
        } catch (error) {
            console.error('Error reordering inventory:', error);
            // Revert local state on error by refetching
            fetchInventoryData(rowId);
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

        // Update local state immediately for better UX
        updatePurchasePricingDataOrder(reorderedData);

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
                    // No need to refetch - local state already updated
                } else {
                    console.error('Failed to reorder purchase pricing:', res.message);
                    // Revert local state on error by refetching
                    fetchPurchasePricingData(rowId);
                }
            };

            await reorderPrintHouseMaterialSupplierApi(callApi, callBack, reorderData);
        } catch (error) {
            console.error('Error reordering purchase pricing:', error);
            // Revert local state on error by refetching
            fetchPurchasePricingData(rowId);
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
            {/* Fixed Add Button - Moves with scroll - RTL Support */}
            <Box sx={{
                position: 'sticky',
                [isRTL ? 'right' : 'left']: isRTL ? `${scrollLeft > 0 ? scrollLeft : 8}px` : `${-scrollLeft > 0 ? scrollLeft : 8}px`,
                top: 0,
                zIndex: 999999,
                padding: '4px 0px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transform: 'translateZ(0)',
                width: '200px', // Exact same as columns: 50px + 150px
                minWidth: '200px',
                maxWidth: '200px',
                margin: 0,
                boxSizing: 'border-box',
            }}>
                <GomakePrimaryButton
                    onClick={() => setIsAddInventoryModalOpen(true)}
                    style={classes.addInventoryButton}
                    startIcon={<AddIcon />}
                >
                    {t("materials.childTable.addNewInventory")}
                </GomakePrimaryButton>
            </Box>

            {isLoadingInventory ? (
                <Box sx={classes.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : inventoryData.length === 0 ? (
                <></>
            ) : (
                <Box sx={{ width: '100%', overflowX: 'visible', position: 'relative', paddingBottom: '8px' }}>
                    <DragDropContext onDragEnd={handleInventoryDragEnd}>
                        <Table sx={{ ...classes.table, position: 'relative' }} stickyHeader>
                            <TableHead>
                                <TableRow sx={classes.headerRow}>
                                    {/* Add drag handle header */}
                                    <TableCell sx={classes.headerCell}></TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.supplierName")}
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.code")}</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        {t("materials.childTable.purchasePrice")}
                                        <br />
                                        {convertedPricingUnit && convertedPricingUnit.value}
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.purchaseCurrency")}</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        {t("materials.childTable.saleCost")}
                                        <br />
                                        {convertedPricingUnit && convertedPricingUnit.value}
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.saleCurrency")}</TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        {t("materials.childTable.inventory")} ({convertedInventoryUnit && convertedInventoryUnit.value})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>
                                        {t("materials.childTable.quantity")} ({convertedInventoryUnit && convertedInventoryUnit.value})
                                    </TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.status")}</TableCell>
                                    <TableCell sx={classes.headerCell}>{t("materials.childTable.client")}</TableCell>
                                    {/* <TableCell sx={classes.headerCell}>{t("materials.childTable.jobs")}</TableCell> */}
                                    <TableCell sx={classes.headerCell}>
                                        {/* {t("materials.childTable.actions")} */}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <Droppable droppableId="inventory-rows">
                                {(provided) => (
                                    <TableBody
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {inventoryData?.map((row, index) => (
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
                                                            sx={classes.bodyCell}
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
                                                                value={row.purchasePrice?.[convertedPricingUnit?.key]?.value || []}
                                                                isEditable={true}
                                                                type={3}
                                                                id={row.id}
                                                                parameterKey={`${convertedPricingUnit?.key} ! purchasePrice`}
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.purchasePrice?.currency?.value?.toLowerCase() || row.purchasePrice?.currency?.toLowerCase()}
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
                                                                value={row.salePrice?.[convertedPricingUnit?.key]?.value || []}
                                                                isEditable={true}
                                                                type={3}
                                                                id={row.id}
                                                                parameterKey={`${convertedPricingUnit?.key} ! salePrice`}
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.salePrice?.currency?.value?.toLowerCase() || row.salePrice?.currency?.toLowerCase()}
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
                                                                value={row.inventory ?? ''}
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
                                                                parameterKey="Active"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={classes.bodyCell}>
                                                            <TableCellData
                                                                value={row.clients || []}
                                                                isEditable={true}
                                                                type={18} // EDataTypeEnum.CLIENTS_LIST
                                                                values={row.clients || []}
                                                                id={row.id}
                                                                parameterKey="clients"
                                                                isAdmin={false}
                                                                onChangeRowCheckBox={() => { }}
                                                                isInventoryTable={true}
                                                                listClient={renderOptionsCustomer}
                                                                checkWhatRenderArrayCustomer={checkWhatRenderArrayCustomer}
                                                            />
                                                        </TableCell>
                                                        {/* <TableCell sx={classes.bodyCell} className="fixed-column">
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
                                                                {t("materials.childTable.show")}
                                                            </Box>
                                                        </TableCell> */}
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
                </Box>
            )}
        </Box>
    );

    const renderPurchasePricingTable = () => (
        <Box sx={classes.childTableContainer}>
            <Box sx={{
                position: 'sticky',
                [isRTL ? 'right' : 'left']: isRTL ? `${scrollLeft > 0 ? scrollLeft : 8}px` : `${-scrollLeft > 0 ? scrollLeft : 8}px`,
                top: 0,
                zIndex: 999999,
                padding: '4px 0px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                transform: 'translateZ(0)',
                width: '200px', // Exact same as columns: 50px + 150px
                minWidth: '200px',
                maxWidth: '200px',
                margin: 0,
                boxSizing: 'border-box',
            }}>
                <GomakePrimaryButton
                    onClick={() => setIsAddPurchasePricingModalOpen(true)}
                    style={classes.addInventoryButton}
                    startIcon={<AddIcon />}
                >
                    {t("materials.sheetPaper.addNewSupplier")}
                </GomakePrimaryButton>
            </Box>
            {isLoadingPurchasePricing ? (
                <Box sx={classes.loadingContainer}>
                    <CircularProgress />
                </Box>
            ) : purchasePricingData.length === 0 ? (
                <></>
            ) : (
                <Box sx={{ width: '100%', overflowX: 'visible', position: 'relative', paddingBottom: '8px' }}>
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
                                        <TableCell sx={classes.headerCell} ></TableCell>
                                        <TableCell sx={classes.headerCell}>
                                            {t("materials.childTable.supplierName")}


                                        </TableCell>
                                        <TableCell sx={classes.headerCell}>
                                            {t("materials.childTable.purchasePrice")}
                                            <br />
                                            {convertedPurchasePricingUnit && convertedPurchasePricingUnit.value}
                                        </TableCell>
                                        <TableCell sx={classes.headerCell}>{t("materials.childTable.currency")}</TableCell>
                                        <TableCell sx={classes.headerCell}>{t("materials.childTable.quantityInPackage")}  ({convertedPurchasePricingInventoryUnit && convertedPurchasePricingInventoryUnit.value})</TableCell>
                                        <TableCell sx={classes.headerCell}>{t("materials.childTable.supplementTimeWorkingDays")}</TableCell>
                                        <TableCell sx={classes.headerCell}>{t("materials.childTable.status")}</TableCell>
                                        <TableCell sx={classes.headerCell}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <Droppable droppableId="purchase-pricing-rows">
                                    {(provided) => (
                                        <TableBody
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
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
                                                            <TableCell
                                                                {...provided.dragHandleProps}
                                                                sx={classes.bodyCell}
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
                                                                    value={(() => {
                                                                        let extractedValue;
                                                                        const pricingData = row.purchasePrice;

                                                                        if (convertedPurchasePricingUnit?.key) {
                                                                            // If a specific key is available, try to get the value from the nested object
                                                                            extractedValue = pricingData?.[convertedPurchasePricingUnit.key]?.value;
                                                                        } else {
                                                                            // If no specific key (convertedPurchasePricingUnit?.key is null/undefined)
                                                                            if (pricingData && typeof pricingData === 'object') {
                                                                                // If pricingData is an object, try to find a 'value' property directly
                                                                                // or take the value from the first available unit key.
                                                                                if ('value' in pricingData) {
                                                                                    extractedValue = pricingData.value;
                                                                                } else {
                                                                                    const firstUnitKey = Object.keys(pricingData)[0];
                                                                                    if (firstUnitKey) {
                                                                                        extractedValue = pricingData[firstUnitKey]?.value;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                // If pricingData is a primitive (number, string) or null/undefined, use it directly
                                                                                extractedValue = pricingData;
                                                                            }
                                                                        }

                                                                        // Ensure the value is an array for TableCellData, filtering out null/undefined
                                                                        return Array.isArray(extractedValue)
                                                                            ? extractedValue.filter(v => v !== undefined && v !== null)
                                                                            : (extractedValue !== undefined && extractedValue !== null ? [extractedValue] : []);
                                                                    })()}
                                                                    isEditable={true}
                                                                    type={3}
                                                                    id={row.id}
                                                                    parameterKey={`${convertedPricingUnit?.key} ! purchasePrice`}
                                                                    isAdmin={false}
                                                                    onChangeRowCheckBox={() => { }}
                                                                    isPurchasePricingTable={true}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={classes.bodyCell}>
                                                                <TableCellData
                                                                    value={row.purchasePrice?.currency}
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
                                                                    parameterKey="Active"
                                                                    isAdmin={false}
                                                                    onChangeRowCheckBox={() => { }}
                                                                    isPurchasePricingTable={true}
                                                                />
                                                            </TableCell>
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
                </Box>

            )}
        </Box>
    );

    const handleCloseAddPurchasePricingModal = () => {
        setIsAddPurchasePricingModalOpen(false);
        setSelectedSupplierForPricing(null);
        setSelectedClientsForPricing([]);
        setFormData({
            supplierId: '',
            purchasePrice: '',
            currency: { value: '', label: '' },
            quantityInPackage: '',
            supplementTime: '',
            order: '',
            isActive: true,
            clients: []
        });
    };

    const handleAddPurchasePricing = async (existingSupplierAction?: ExistingSupplierActionEnum) => {
        try {
            // Validate required fields (only if not handling existing supplier action)
            if (existingSupplierAction === null || existingSupplierAction === undefined) {
                if (!selectedSupplierForPricing?.id && !formData.supplierId) {
                    alertRequiredFields();
                    return;
                }

                if (formData?.purchasePrice === null || formData?.purchasePrice === undefined || formData?.purchasePrice === '' || parseFloat(formData?.purchasePrice) < 0) {
                    alertRequiredFields();
                    return;
                }

                if (!formData?.currency?.value) {
                    alertRequiredFields();
                    return;
                }

                if (formData?.quantityInPackage === null || formData?.quantityInPackage === undefined || formData?.quantityInPackage === '' || parseInt(formData?.quantityInPackage) < 0) {
                    alertRequiredFields();
                    return;
                }
            }

            const requestBody = {
                printHouseMaterialId: rowId,
                supplierId: selectedSupplierForPricing?.id || formData.supplierId,
                price: parseFloat(formData.purchasePrice) || 0,
                currency: formData.currency.value,
                isActive: formData.isActive,
                stock: 0,
                quantity: parseInt(formData.quantityInPackage) || 0,
                supplementTime: parseInt(formData.supplementTime) || 0,
                ...(existingSupplierAction >= 0 && { existingSupplierAction }),
            };

            const callBack = (res) => {
                if (res.success) {
                    // Refresh the purchase pricing data
                    fetchPurchasePricingData(rowId);
                    handleCloseAddPurchasePricingModal();
                    setIsExistingSupplierModalOpen(false);
                    setPendingPurchasePricingData(null);
                } else {
                    if (res?.data?.statusCode === 94) {
                        // Existing supplier conflict - show options modal
                        alertFault(`${res?.data?.ErrorMessage}`);

                    }
                    else if (res?.data?.statusCode === 103) {
                        alertFault(`${res?.data?.ErrorMessage}`);
                        setPendingPurchasePricingData(requestBody);
                        setIsExistingSupplierModalOpen(true);
                    }
                    else {
                        alertFaultAdded();
                    }
                }
            };

            await addPrintHouseMaterialSupplierApi(callApi, callBack, requestBody);
        } catch (error) {
            console.error('Error adding purchase pricing:', error);
        }
    };

    const handleExistingSupplierAction = (action: ExistingSupplierActionEnum) => {
        if (pendingPurchasePricingData) {
            handleAddPurchasePricing(action);
        }
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
        setSelectedClients([]);
        setInventoryFormData({
            printHouseMaterialId: '',
            supplierId: '',
            code: '',
            quantity: null,
            inventory: null,
            isActive: true,
            purchasePrice: null,
            salePrice: null,
            clients: [],
            purchaseCurrency: { value: '', label: '' },
            saleCurrency: { value: '', label: '' },
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

    const handleClientSelect = (e, client: any) => {
        const newClients = client ? [client] : [];
        setSelectedClients(newClients);
        handleInventoryFormChange('clients', newClients.map(c => c.id));
    };

    // Function to update Total Inventory in parent table
    const updateTotalInventoryInParent = (materialId: string, newTotalInventory: number) => {
        setMaterialCategoryData(prevData =>
            prevData.map(row => {
                if (row.id === materialId) {
                    // Create a new row object with updated inventory data
                    const updatedRow = { ...row };
                    // Common field names could be 'inventory', 'totalInventory', 'stock', etc.
                    const inventoryFields = ['totalInventory'];

                    for (const field of inventoryFields) {
                        if (updatedRow.rowData[field] !== undefined) {
                            updatedRow.rowData = {
                                ...updatedRow.rowData,
                                [field]: {
                                    ...updatedRow.rowData[field],
                                    value: newTotalInventory.toString()
                                }
                            };
                            break;
                        }
                    }

                    return updatedRow;
                }
                return row;
            })
        );
    };

    const handleAddInventory = async () => {
        try {
            // Validate required fields
            if (!inventoryFormData?.supplierId) {
                alertRequiredFields();
                return;
            }

            if (!inventoryFormData?.quantity) {
                alertRequiredFields();
                return;
            }

            if (inventoryFormData?.purchasePrice === null || inventoryFormData?.purchasePrice === undefined || inventoryFormData?.purchasePrice === '' || inventoryFormData?.purchasePrice < 0) {
                alertRequiredFields();
                return;
            }

            if (!inventoryFormData?.purchaseCurrency?.value) {
                alertRequiredFields();
                return;
            }

            if (inventoryFormData?.salePrice === null || inventoryFormData?.salePrice === undefined || inventoryFormData?.salePrice === '' || inventoryFormData?.salePrice < 0) {
                alertRequiredFields();
                return;
            }

            if (!inventoryFormData?.saleCurrency?.value) {
                alertRequiredFields();
                return;
            }

            const inventoryData = {
                printHouseMaterialId: rowId,
                supplierId: inventoryFormData?.supplierId,
                code: inventoryFormData?.code,
                quantity: parseInt(inventoryFormData?.quantity?.toString()) || 0,
                isActive: inventoryFormData?.isActive,
                purchasePrice: parseFloat(inventoryFormData?.purchasePrice?.toString()) || 0,
                salePrice: parseFloat(inventoryFormData?.salePrice?.toString()) || 0,
                clients: inventoryFormData?.clients,
                saleCurrency: inventoryFormData?.saleCurrency?.value,
                purchaseCurrency: inventoryFormData?.purchaseCurrency?.value,
            };

            const callBack = (res) => {
                if (res.success) {
                    // Update Total Inventory in parent table
                    if (typeof res.data === 'number') {
                        updateTotalInventoryInParent(rowId, res.data);
                    }

                    // Refresh the inventory data
                    fetchInventoryData(rowId);
                    handleCloseAddInventoryModal();
                } else {
                    console.error('Failed to add inventory:', res.message);
                }
            };

            await addSupplierInventoryApi(callApi, callBack, inventoryData);
        } catch (error) {
            console.log('Error adding inventory:', error);
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
                    // Update local state instead of refetching
                    removePurchasePricingDataItem(selectedRowForDelete.id);
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
                    // Update Total Inventory in parent table
                    if (typeof res.data === 'number') {
                        updateTotalInventoryInParent(rowId, res.data);
                    }

                    // Update local state instead of refetching
                    removeInventoryDataItem(selectedRowForDelete.id);
                    handleCloseDeleteModal();
                } else {
                    alertFault(`${res.message}`);
                }
            };

            await deleteSupplierInventoryApi(callApi, callBack, selectedRowForDelete.id);
        } catch (error) {
            alertFault(`${error}`);
        }
    };

    return (
        <Box sx={classes.mainContainer}>
            {openChildTable.tableType === 'inventory' && renderInventoryTable()}
            {openChildTable.tableType === 'purchasePricing' && renderPurchasePricingTable()}

            {/* Add Purchase Pricing Modal */}
            <AddPurchasePricingModal
                isAddPurchasePricingModalOpen={isAddPurchasePricingModalOpen}
                handleCloseAddPurchasePricingModal={handleCloseAddPurchasePricingModal}
                t={t}
                classes={classes}
                selectedSupplierForPricing={selectedSupplierForPricing}
                handleSupplierSelectForPricing={handleSupplierSelectForPricing}
                renderOptionsSupplier={renderOptionsSupplier}
                checkWhatRenderArraySupplier={checkWhatRenderArraySupplier}
                isFetchingSupplier={isFetchingSupplier}
                formData={formData}
                handleFormChange={handleFormChange}
                handleAddPurchasePricing={handleAddPurchasePricing}
                purchasePricingTableHeadingUnits={purchasePricingTableHeadingUnits}
                setOpenSupplierModal={setOpenSupplierModal}
            />

            {/* Add Inventory Modal */}
            <AddInventoryModal
                isAddInventoryModalOpen={isAddInventoryModalOpen}
                handleCloseAddInventoryModal={handleCloseAddInventoryModal}
                t={t}
                classes={classes}
                selectedSupplier={selectedSupplier}
                handleSupplierSelect={handleSupplierSelect}
                renderOptionsSupplier={renderOptionsSupplier}
                checkWhatRenderArraySupplier={checkWhatRenderArraySupplier}
                isFetchingSupplier={isFetchingSupplier}
                inventoryFormData={inventoryFormData}
                handleAddInventory={handleAddInventory}
                inventoryTableHeadingUnits={inventoryTableHeadingUnits}
                setOpenSupplierModal={setOpenSupplierModal}
                handleInventoryFormChange={handleInventoryFormChange}
                selectedClients={selectedClients}
                handleClientSelect={handleClientSelect}
                renderOptionsCustomer={renderOptionsCustomer}
                checkWhatRenderArrayCustomer={checkWhatRenderArrayCustomer}
                isFetchingCustomer={isFetchingCustomer}
            />

            {/* Delete Confirmation Modal */}
            <GoMakeDeleteModal
                modalType={ModalType.DELETE}
                openModal={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onClickDelete={openChildTable.tableType === 'inventory' ? handleDeleteInventory : handleDeletePurchasePricing}
            />

            {/* Existing Supplier Action Modal */}
            <ThreeOptionsModal
                modalType={ModalType.WARNING}
                title="materials.modals.existingSupplierTitle"
                subTitle="materials.modals.existingSupplierSubTitle"
                yesBtn="materials.modals.activateOnly"
                noBtn="materials.modals.activateAndOverride"
                cancelBtn="modal.cancel"
                openModal={isExistingSupplierModalOpen}
                onClose={() => {
                    setIsExistingSupplierModalOpen(false);
                    setPendingPurchasePricingData(null);
                }}
                onClickYes={() => handleExistingSupplierAction(ExistingSupplierActionEnum.ActivateOnly)}
                onClickNo={() => handleExistingSupplierAction(ExistingSupplierActionEnum.ActivateAndOverride)}
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
            <CustomerCardWidget
                customerAction={CUSTOMER_ACTIONS.Add}
                typeClient={CLIENT_TYPE.SUPPLIER}
                onCustomerAdd={onSupplierAdd}
                openModal={openSupplierModal}
                onClose={onCloseSupplierModal}
                customer={supplier}
                setCustomer={setSupplier}
            />
        </Box>
    );
};

export { ChildTableRow };
