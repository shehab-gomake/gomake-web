import React, { useState, useRef, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, openJobsModalState, openAddSupplierModalState } from "../../state";
import { useTranslation } from "react-i18next";
import { JobsModal } from "../jobs-modal/jobs-modal";
import { ChildTableRow } from "../child-table-row/child-table-row";
import { ChevronRight } from "@mui/icons-material";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { useStyle } from "./style";


interface ICombinedTableProps {
    headers: any[];
    rows: any[];
    renderOptions: any;
    checkWhatRenderArray: any;
    isFetching: boolean;
    materialType?: string;
    materialCategory?: string;
}

const CombinedTable = ({
    headers,
    rows,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    materialType,
    materialCategory,
}: ICombinedTableProps) => {
    const { classes, getHeaderCellStyle, getBodyCellStyle } = useStyle();
    const { t } = useTranslation();
    const openChildTable = useRecoilValue(openChildTableState);
    const jobsModal = useRecoilValue(openJobsModalState);
    const setJobsModal = useSetRecoilState(openJobsModalState);
    const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);

    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const tableContainerRef = useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
        if (tableContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance
            setShowScrollIndicator(!isAtEnd);
        }
    };

    const scrollToRight = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({
                left: tableContainerRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            // Check initial scroll state
            handleScroll();

            // Add scroll listener
            container.addEventListener('scroll', handleScroll);

            // Cleanup
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [rows]); // Re-check when rows change



    return (
        <>
            <Box sx={classes.mainContainer}>
                <TableContainer
                    ref={tableContainerRef}
                    component={Paper}
                    sx={classes.tableContainer}
                >
                    <Table sx={classes.table} stickyHeader>
                        <TableHead>
                            <TableRow sx={classes.headerRow}>
                                {headers?.map((header, index) => {
                                    const isFirstColumn = index === 0;
                                    const isLastFixedColumn = index >= Math.max(headers.length - 3, 0); // Last 3 columns
                                    return (
                                        <TableCell
                                            key={index}
                                            sx={getHeaderCellStyle(isFirstColumn, isLastFixedColumn, index, headers.length)}
                                        >
                                            {header}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows?.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <TableRow sx={classes.bodyRow}>
                                        {row.cells?.map((cell, cellIndex) => {
                                            const isFirstColumn = cellIndex === 0;
                                            const isLastFixedColumn = cellIndex >= Math.max(headers.length - 3, 0);
                                            const isFixedColumn = isFirstColumn || isLastFixedColumn;


                                            return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={isFixedColumn ? 'fixed-column' : ''}
                                                    sx={getBodyCellStyle(isFirstColumn, isLastFixedColumn, cellIndex, headers.length)}
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
                                                sx={classes.childTableRowContainer}
                                            >
                                                <Box sx={classes.childTableContentBox}>
                                                    <ChildTableRow
                                                        rowId={row.id}
                                                        isVisible={true}
                                                        renderOptions={renderOptions}
                                                        checkWhatRenderArray={checkWhatRenderArray}
                                                        isFetching={isFetching}
                                                        materialType={materialType}
                                                        materialCategory={materialCategory}
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

                {/* Scroll Indicator Button - positioned at first fixed column */}
                {showScrollIndicator && (
                    <Tooltip title="Scroll to see more columns" arrow>
                        <IconButton
                            onClick={scrollToRight}
                            sx={classes.scrollIndicatorButton}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

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
