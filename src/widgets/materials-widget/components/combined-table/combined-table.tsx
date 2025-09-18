import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, openJobsModalState, openAddSupplierModalState } from "../../state";
import { useTranslation } from "react-i18next";
import { JobsModal } from "../jobs-modal/jobs-modal";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TableCellData } from "../table-cell-data/table-cell";
import { EDataTypeEnum } from "../table-cell-data/data-type-enum";

// Mock data for inventory child table
const mockInventoryData = [
    {
        id: "inv-1",
        supplierName: { value: "Fares", type: EDataTypeEnum.STRING, isEditable: true },
        code: { value: "1234", type: EDataTypeEnum.STRING, isEditable: true },
        purchaseM2Price: { value: "0.070", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseRollPrice: { value: "5800", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        saleM2Price: { value: "0.080", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleRollPrice: { value: "5800", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        lengthStock: { value: "20", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "m" },
        client: { value: "Tirapress", type: EDataTypeEnum.STRING, isEditable: true },
        jobs: "Show"
    },
    {
        id: "inv-2",
        supplierName: { value: "Fares", type: EDataTypeEnum.STRING, isEditable: true },
        code: { value: "1234-B", type: EDataTypeEnum.STRING, isEditable: true },
        purchaseM2Price: { value: "0.071", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseRollPrice: { value: "5750", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        saleM2Price: { value: "0.082", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleRollPrice: { value: "5750", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        lengthStock: { value: "12", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "m" },
        client: { value: "BluePrint", type: EDataTypeEnum.STRING, isEditable: true },
        jobs: "Show"
    },
    {
        id: "inv-3",
        supplierName: { value: "mohand", type: EDataTypeEnum.STRING, isEditable: true },
        code: { value: "7852", type: EDataTypeEnum.STRING, isEditable: true },
        purchaseM2Price: { value: "0.073", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseRollPrice: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        saleM2Price: { value: "0.080", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleRollPrice: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        lengthStock: { value: "50", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "m" },
        client: { value: "Tirapress", type: EDataTypeEnum.STRING, isEditable: true },
        jobs: "Show"
    },
    {
        id: "inv-4",
        supplierName: { value: "Aous", type: EDataTypeEnum.STRING, isEditable: true },
        code: { value: "7852", type: EDataTypeEnum.STRING, isEditable: true },
        purchaseM2Price: { value: "0.073", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseRollPrice: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        saleM2Price: { value: "0.080", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleRollPrice: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        saleCurrency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        lengthStock: { value: "50", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "m" },
        client: { value: "—", type: EDataTypeEnum.STRING, isEditable: true },
        jobs: "Show"
    }
];

// Mock data for purchase pricing child table
const mockPurchasePricingData = [
    {
        id: "pp-1",
        purchaseOrderM2Cost: { value: "0.070", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseOrderRollCost: { value: "5800", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        currency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        supplyingTime: { value: "5", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "days" }
    },
    {
        id: "pp-2",
        purchaseOrderM2Cost: { value: "0.071", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseOrderRollCost: { value: "5750", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        currency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        supplyingTime: { value: "3", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "days" }
    },
    {
        id: "pp-3",
        purchaseOrderM2Cost: { value: "0.073", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseOrderRollCost: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        currency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        supplyingTime: { value: "7", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "days" }
    },
    {
        id: "pp-4",
        purchaseOrderM2Cost: { value: "0.073", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        purchaseOrderRollCost: { value: "5850", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "$" },
        currency: {
            value: "Dollar", type: EDataTypeEnum.LIST, isEditable: true, values: [
                { key: "dollar", value: "Dollar" },
                { key: "euro", value: "Euro" },
                { key: "pound", value: "Pound" }
            ]
        },
        supplyingTime: { value: "4", type: EDataTypeEnum.NUMBER, isEditable: true, unit: "days" }
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
    const jobsModal = useRecoilValue(openJobsModalState);
    const setJobsModal = useSetRecoilState(openJobsModalState);
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);

    const handleOpenJobsModal = (supplierName: string, materialCode: string, materialName: string = "m1") => {
        setJobsModal({
            open: true,
            supplierName,
            materialCode,
            materialName
        });
    };

    const handleCloseJobsModal = () => {
        setJobsModal({ open: false });
    };

    const handleOpenAddSupplierModal = () => {
        setOpenAddSupplierModal(true);
    };

    const renderInventoryTable = () => (
        <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%' }}>
            <Table size="small" stickyHeader sx={{ tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#EBECFF' }}>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: '#EBECFF' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                Supplier Name
                                <Tooltip title="Add Supplier">
                                    <IconButton
                                        size="small"
                                        onClick={handleOpenAddSupplierModal}
                                        sx={{
                                            color: '#9c27b0',
                                            '&:hover': {
                                                backgroundColor: '#f3e5f5',
                                            }
                                        }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </TableCell>
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
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.supplierName.value}
                                    type={row.supplierName.type}
                                    isEditable={row.supplierName.isEditable}
                                    id={row.id}
                                    parameterKey="supplierName"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.code.value}
                                    type={row.code.type}
                                    isEditable={row.code.isEditable}
                                    id={row.id}
                                    parameterKey="code"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.purchaseM2Price.value}
                                    type={row.purchaseM2Price.type}
                                    isEditable={row.purchaseM2Price.isEditable}
                                    unit={row.purchaseM2Price.unit}
                                    id={row.id}
                                    parameterKey="purchaseM2Price"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.purchaseRollPrice.value}
                                    type={row.purchaseRollPrice.type}
                                    isEditable={row.purchaseRollPrice.isEditable}
                                    unit={row.purchaseRollPrice.unit}
                                    id={row.id}
                                    parameterKey="purchaseRollPrice"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.purchaseCurrency.value}
                                    type={row.purchaseCurrency.type}
                                    isEditable={row.purchaseCurrency.isEditable}
                                    values={row.purchaseCurrency.values}
                                    id={row.id}
                                    parameterKey="purchaseCurrency"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.saleM2Price.value}
                                    type={row.saleM2Price.type}
                                    isEditable={row.saleM2Price.isEditable}
                                    unit={row.saleM2Price.unit}
                                    id={row.id}
                                    parameterKey="saleM2Price"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.saleRollPrice.value}
                                    type={row.saleRollPrice.type}
                                    isEditable={row.saleRollPrice.isEditable}
                                    unit={row.saleRollPrice.unit}
                                    id={row.id}
                                    parameterKey="saleRollPrice"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.saleCurrency.value}
                                    type={row.saleCurrency.type}
                                    isEditable={row.saleCurrency.isEditable}
                                    values={row.saleCurrency.values}
                                    id={row.id}
                                    parameterKey="saleCurrency"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.lengthStock.value}
                                    type={row.lengthStock.type}
                                    isEditable={row.lengthStock.isEditable}
                                    unit={row.lengthStock.unit}
                                    id={row.id}
                                    parameterKey="lengthStock"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.client.value}
                                    type={row.client.type}
                                    isEditable={row.client.isEditable}
                                    id={row.id}
                                    parameterKey="client"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <Box
                                    onClick={() => handleOpenJobsModal(row.supplierName.value, row.code.value, "m1")}
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
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.purchaseOrderM2Cost.value}
                                    type={row.purchaseOrderM2Cost.type}
                                    isEditable={row.purchaseOrderM2Cost.isEditable}
                                    unit={row.purchaseOrderM2Cost.unit}
                                    id={row.id}
                                    parameterKey="purchaseOrderM2Cost"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.purchaseOrderRollCost.value}
                                    type={row.purchaseOrderRollCost.type}
                                    isEditable={row.purchaseOrderRollCost.isEditable}
                                    unit={row.purchaseOrderRollCost.unit}
                                    id={row.id}
                                    parameterKey="purchaseOrderRollCost"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.currency.value}
                                    type={row.currency.type}
                                    isEditable={row.currency.isEditable}
                                    values={row.currency.values}
                                    id={row.id}
                                    parameterKey="currency"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                <TableCellData
                                    value={row.supplyingTime.value}
                                    type={row.supplyingTime.type}
                                    isEditable={row.supplyingTime.isEditable}
                                    unit={row.supplyingTime.unit}
                                    id={row.id}
                                    parameterKey="supplyingTime"
                                    isAdmin={isAdmin}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <>
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

            {/* Jobs Modal */}
            <JobsModal
                open={jobsModal.open}
                onClose={handleCloseJobsModal}
                supplierName={jobsModal.supplierName}
                materialCode={jobsModal.materialCode}
                materialName={jobsModal.materialName}
            />
        </>
    );
};

export { CombinedTable };
