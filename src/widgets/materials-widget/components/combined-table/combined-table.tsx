import React, { useState, useRef, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { openChildTableState, showMoreFiltersState } from "../../state";
import { useTranslation } from "react-i18next";
import { ChildTableRow } from "../child-table-row/child-table-row";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { useStyle } from "./style";


interface ICombinedTableProps {
    headers: any[];
    rows: any[];
    materialType?: string;
    materialCategory?: string;
    renderOptionsCustomer?: any;
    checkWhatRenderArrayCustomer?: any;
    isFetchingCustomer?: boolean;
    renderOptionsSupplier?: any;
    checkWhatRenderArraySupplier?: any;
    isFetchingSupplier?: boolean;
    onLoadMore?: () => void;
    hasMoreData?: boolean;
    isLoadingMore?: boolean;
    filterBarHeight?: number;
}

const CombinedTable = ({
    headers,
    rows,
    materialType,
    materialCategory,
    renderOptionsCustomer,
    isFetchingCustomer,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    checkWhatRenderArrayCustomer,
    onLoadMore,
    hasMoreData = false,
    isLoadingMore = false,
    filterBarHeight = 40,
}: ICombinedTableProps) => {
    const { classes, getHeaderCellStyle, getBodyCellStyle } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const openChildTable = useRecoilValue(openChildTableState);

    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = () => {
        if (tableContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;

            // Check vertical scroll for infinite loading
            const scrolledToBottom = scrollHeight - scrollTop - clientHeight;
            // Trigger load more when user is 200px from the bottom (or has scrolled ~75% of visible area)
            const threshold = Math.min(200, clientHeight * 0.75);

            if (scrolledToBottom < threshold && hasMoreData && !isLoadingMore && !isLoadingRef.current && onLoadMore) {
                // Clear any pending timeout
                if (loadMoreTimeoutRef.current) {
                    clearTimeout(loadMoreTimeoutRef.current);
                }

                // Set loading flag immediately to prevent duplicate calls
                isLoadingRef.current = true;

                // Debounce the actual call
                loadMoreTimeoutRef.current = setTimeout(() => {
                    onLoadMore();
                }, 100);
            }

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

    // Reset loading ref when loading completes
    useEffect(() => {
        if (!isLoadingMore) {
            isLoadingRef.current = false;
        }
    }, [isLoadingMore]);

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
                if (loadMoreTimeoutRef.current) {
                    clearTimeout(loadMoreTimeoutRef.current);
                }
            };
        }
    }, [rows, hasMoreData, isLoadingMore]); // Re-check when rows change

    const [showMore, setShowMore] = useRecoilState(showMoreFiltersState);

    // Calculate dynamic table height based on actual filter bar height
    // Base offset: 120px (header) + 10px (padding) + filterBarHeight
    const tableMaxHeight = `calc(100vh - ${110 + filterBarHeight}px)`;

    return (
        <>
            <Box sx={classes.mainContainer}>
                <TableContainer
                    ref={tableContainerRef}
                    component={Paper}
                    sx={{ ...classes.tableContainer, maxHeight: tableMaxHeight }}
                >
                    <Table sx={classes.table} stickyHeader>
                        <TableHead>
                            <TableRow sx={classes.headerRow}>
                                {headers?.map((header, index) => {
                                    const isFirstColumn = index === 0;
                                    const isLastFixedColumn = index >= Math.max(headers.length - 4, 0); // Last 4 columns
                                    const isLastColumn = index === headers.length - 1;
                                    const isLastSecondColumn = index === headers.length - 2;
                                    const isLastThirdColumn = index === headers.length - 3;
                                    const isLastFourthColumn = index === headers.length - 4;
                                    return (
                                        <TableCell
                                            key={index}
                                            sx={getHeaderCellStyle(isFirstColumn, isLastFixedColumn, index, headers.length, isLastColumn, isLastSecondColumn, isLastThirdColumn, isLastFourthColumn)}
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
                                            const isLastFixedColumn = cellIndex >= Math.max(headers.length - 4, 0);
                                            const isLastColumn = cellIndex === headers.length - 1;
                                            const isLastSecondColumn = cellIndex === headers.length - 2;
                                            const isLastThirdColumn = cellIndex === headers.length - 3;
                                            const isLastFourthColumn = cellIndex === headers.length - 4;
                                            const isFixedColumn = isFirstColumn || isLastFixedColumn;


                                            return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={isFixedColumn ? 'fixed-column' : ''}
                                                    sx={getBodyCellStyle(isFirstColumn, isLastFixedColumn, cellIndex, headers.length, isLastColumn, isLastSecondColumn, isLastThirdColumn, isLastFourthColumn)}
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
                                                        materialType={materialType}
                                                        materialCategory={materialCategory}
                                                        renderOptionsCustomer={renderOptionsCustomer}
                                                        checkWhatRenderArrayCustomer={checkWhatRenderArrayCustomer}
                                                        isFetchingCustomer={isFetchingCustomer}
                                                        renderOptionsSupplier={renderOptionsSupplier}
                                                        checkWhatRenderArraySupplier={checkWhatRenderArraySupplier}
                                                        isFetchingSupplier={isFetchingSupplier}
                                                    />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                    {/* Loading indicator for infinite scroll */}
                    {isLoadingMore && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px',
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    border: '3px solid #e0e0e0',
                                    borderTop: '3px solid #1976d2',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </TableContainer>

                {/* Scroll Indicator Button - positioned at first fixed column */}
                {showScrollIndicator && (
                    <Tooltip title={t("materials.childTable.scrollToSeeMoreColumns")} arrow>
                        <IconButton
                            onClick={scrollToRight}
                            sx={classes.scrollIndicatorButton}
                        >
                            {isRTL ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </>
    );
};

export { CombinedTable };
