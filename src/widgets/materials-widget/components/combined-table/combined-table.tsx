import React, { useState, useRef, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, openJobsModalState, openAddSupplierModalState } from "../../state";
import { useTranslation } from "react-i18next";
import { JobsModal } from "../jobs-modal/jobs-modal";
import { ChildTableRow } from "../child-table-row/child-table-row";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { useStyle } from "./style";


interface ICombinedTableProps {
    headers: any[];
    rows: any[];
    renderOptions: any;
    checkWhatRenderArray: any;
    isFetching: boolean;
    materialType?: string;
    materialCategory?: string;
    renderOptionsCustomer?: any;
    checkWhatRenderArrayCustomer?: any;
    isFetchingCustomer?: boolean;
}

const CombinedTable = ({
    headers,
    rows,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    materialType,
    materialCategory,
    renderOptionsCustomer,
    checkWhatRenderArrayCustomer,
    isFetchingCustomer,
}: ICombinedTableProps) => {
    const { classes, getHeaderCellStyle, getBodyCellStyle } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
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



    const handleScroll = () => {
        if (tableContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;

            let isAtEnd;
            if (isRTL) {
                // In RTL (Arabic), scrollLeft starts at 0 and becomes negative as we scroll left
                // Hide indicator when we've scrolled all the way to the left (most negative value)
                const maxScrollLeft = scrollWidth - clientWidth;
                isAtEnd = Math.abs(scrollLeft) >= maxScrollLeft - 5; // 5px tolerance
            } else {
                // In LTR, hide indicator when scrolled to the right edge
                isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance
            }

            setShowScrollIndicator(!isAtEnd);
        }
    };

    const scrollToRight = () => {
        if (tableContainerRef.current) {
            if (isRTL) {
                // In RTL (Arabic), scroll to the leftmost position (negative scrollLeft)
                const maxScrollLeft = tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth;
                tableContainerRef.current.scrollTo({
                    left: -maxScrollLeft,
                    behavior: 'smooth'
                });
            } else {
                // In LTR, scroll to the rightmost position
                tableContainerRef.current.scrollTo({
                    left: tableContainerRef.current.scrollWidth,
                    behavior: 'smooth'
                });
            }
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
                                    const isLastColumn = index === headers.length - 1;
                                    const isLastSecondColumn = index === headers.length - 2;
                                    const isLastThirdColumn = index === headers.length - 3;
                                    return (
                                        <TableCell
                                            key={index}
                                            sx={getHeaderCellStyle(isFirstColumn, isLastFixedColumn, index, headers.length, isLastColumn, isLastSecondColumn, isLastThirdColumn)}
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
                                            const isLastColumn = cellIndex === headers.length - 1;
                                            const isLastSecondColumn = cellIndex === headers.length - 2;
                                            const isLastThirdColumn = cellIndex === headers.length - 3;
                                            const isFixedColumn = isFirstColumn || isLastFixedColumn;


                                            return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={isFixedColumn ? 'fixed-column' : ''}
                                                    sx={getBodyCellStyle(isFirstColumn, isLastFixedColumn, cellIndex, headers.length, isLastColumn, isLastSecondColumn, isLastThirdColumn)}
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
                                                        renderOptionsCustomer={renderOptionsCustomer}
                                                        checkWhatRenderArrayCustomer={checkWhatRenderArrayCustomer}
                                                        isFetchingCustomer={isFetchingCustomer}
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
                            {isRTL ? <ChevronLeft /> : <ChevronRight />}
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
