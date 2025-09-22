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
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChildTableRow } from "../child-table-row/child-table-row";


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
    const { secondColor } = useGomakeTheme();
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


    const fixedColumnsCount = 4; // Last 4 columns: Inventory, Purchase Pricing, Active, More

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 750,
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    position: 'relative',
                    '&::-webkit-scrollbar': {
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c1c1c1',
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: '#a8a8a8',
                        },
                    },
                }}
            >
                <Table sx={{ minWidth: '1200px' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#EBECFF' }}>
                            {headers.map((header, index) => {
                                const isFixedColumn = index >= headers.length - fixedColumnsCount;
                                return (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                            padding: '12px 8px',
                                            backgroundColor: '#EBECFF',
                                            minWidth: isFixedColumn ? '120px' : '100px',
                                            ...(isFixedColumn && {
                                                position: 'sticky',
                                                right: (fixedColumnsCount - (index - (headers.length - fixedColumnsCount)) - 1) * 120,
                                                zIndex: 10,
                                                boxShadow: index === headers.length - fixedColumnsCount ? '-2px 0 4px rgba(0,0,0,0.1)' : 'none'
                                            })
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                <TableRow sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                                    {row.cells.map((cell, cellIndex) => {
                                        const isFixedColumn = cellIndex >= headers.length - fixedColumnsCount;
                                        return (
                                            <TableCell
                                                key={cellIndex}
                                                sx={{
                                                    textAlign: 'center',
                                                    padding: '12px 8px',
                                                    whiteSpace: 'nowrap',
                                                    minWidth: isFixedColumn ? '120px' : '100px',
                                                    borderBottom: '1px solid #e0e0e0',
                                                    ...(isFixedColumn && {
                                                        position: 'sticky',
                                                        right: (fixedColumnsCount - (cellIndex - (headers.length - fixedColumnsCount)) - 1) * 120,
                                                        zIndex: 5,
                                                        backgroundColor: '#fff',
                                                        boxShadow: cellIndex === headers.length - fixedColumnsCount ? '-2px 0 4px rgba(0,0,0,0.1)' : 'none'
                                                    })
                                                }}
                                            >
                                                {cell}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                                {/* Check if this row has an open child table */}
                                {openChildTable.rowId === row.id && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={headers.length}
                                            sx={{
                                                padding: 0,
                                                border: 'none',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                        >
                                            <Box sx={{
                                                padding: '16px',
                                                backgroundColor: '#f8f9fa',
                                                borderTop: '1px solid #e0e0e0',
                                                borderBottom: '1px solid #e0e0e0'
                                            }}>
                                                <ChildTableRow
                                                    rowId={row.id}
                                                    isVisible={true}
                                                />
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
