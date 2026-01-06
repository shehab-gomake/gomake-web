import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Button } from "@mui/material";
import { useRecoilValue } from "recoil";
import { openChildTableState, materialHeadersState } from "../../state";
import { useTranslation } from "react-i18next";
import { ChildTableRow } from "../child-table-row/child-table-row";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { useStyle } from "./style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";


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
    isAdmin?: boolean;
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
    isAdmin = false,
}: ICombinedTableProps) => {
    const { classes, getHeaderCellStyle, getBodyCellStyle } = useStyle();
    const { secondColor } = useGomakeTheme();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const openChildTable = useRecoilValue(openChildTableState);
    const materialHeaders = useRecoilValue(materialHeadersState);

    // Calculate hidden columns count - columns that are scrolled off to the right
    const calculateHiddenColumns = useCallback(() => {
        if (!tableContainerRef.current || !headers || headers.length === 0) {
            setHiddenColumnsCount(0);
            return;
        }

        const container = tableContainerRef.current;
        const { scrollWidth, clientWidth } = container;

        // If table is not scrollable, no hidden columns
        if (scrollWidth <= clientWidth) {
            setHiddenColumnsCount(0);
            return;
        }

        const table = container.querySelector('table');
        if (!table) {
            setHiddenColumnsCount(0);
            return;
        }

        // Get header row to count visible columns
        const headerRow = table.querySelector('thead tr');
        if (!headerRow) {
            setHiddenColumnsCount(0);
            return;
        }

        const headerCells = headerRow.querySelectorAll('th');
        if (headerCells.length === 0 || headerCells.length !== headers.length) {
            setHiddenColumnsCount(0);
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;

        // Count how many columns are visible in the viewport
        // The last 2 columns are fixed, so we need to find the last non-fixed visible column
        const totalColumns = headers.length;
        const fixedColumnsCount = 2; // Last 2 columns are fixed (Status and Total Inventory)
        let lastNonFixedVisibleIndex = -1;

        headerCells.forEach((cell, index) => {
            // Skip fixed columns (last 2)
            if (index < totalColumns - fixedColumnsCount) {
                const cellRect = cell.getBoundingClientRect();
                // Column is visible if any part of it is in the viewport
                if (cellRect.right > containerLeft && cellRect.left < containerRight) {
                    lastNonFixedVisibleIndex = index;
                }
            }
        });

        // Calculate columns that are to the right of the last visible non-fixed column
        const scrollableColumnsCount = totalColumns - fixedColumnsCount;
        const visibleScrollableColumns = lastNonFixedVisibleIndex + 1;
        const hiddenScrollableColumns = scrollableColumnsCount - visibleScrollableColumns;

        // Total hidden = hidden scrollable columns (fixed columns are always visible, so don't count them)
        const count = hiddenScrollableColumns > 0 ? hiddenScrollableColumns : 0;
        setHiddenColumnsCount(count);
    }, [headers]);

    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const [hiddenColumnsCount, setHiddenColumnsCount] = useState(0);
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

        // Recalculate hidden columns on scroll (debounced)
        setTimeout(() => {
            calculateHiddenColumns();
        }, 50);
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

    const scrollToLastColumn = () => {
        if (tableContainerRef.current) {
            if (isRTL) {
                // In RTL, scroll to the leftmost position
                const maxScrollLeft = tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth;
                tableContainerRef.current.scrollTo({
                    left: -maxScrollLeft,
                    behavior: 'smooth'
                });
            } else {
                // In LTR, scroll to the rightmost position to show last column
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

            // Calculate hidden columns initially (with delay to ensure DOM is ready)
            const timeoutId1 = setTimeout(() => {
                calculateHiddenColumns();
            }, 100);

            const timeoutId2 = setTimeout(() => {
                calculateHiddenColumns();
            }, 500);

            // Add scroll listener
            container.addEventListener('scroll', handleScroll);

            // Cleanup
            return () => {
                clearTimeout(timeoutId1);
                clearTimeout(timeoutId2);
                container.removeEventListener('scroll', handleScroll);
                if (loadMoreTimeoutRef.current) {
                    clearTimeout(loadMoreTimeoutRef.current);
                }
            };
        }
    }, [rows, hasMoreData, isLoadingMore, headers, calculateHiddenColumns]); // Re-check when rows or headers change

    // Recalculate when headers change
    useEffect(() => {
        const timeoutId1 = setTimeout(() => {
            calculateHiddenColumns();
        }, 100);
        const timeoutId2 = setTimeout(() => {
            calculateHiddenColumns();
        }, 500);
        const timeoutId3 = setTimeout(() => {
            calculateHiddenColumns();
        }, 1000);
        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
        };
    }, [headers, calculateHiddenColumns]);

    // Use ResizeObserver to recalculate when table size changes
    useEffect(() => {
        const container = tableContainerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            setTimeout(() => {
                calculateHiddenColumns();
            }, 100);
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [calculateHiddenColumns]);

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
                                    const isLastFixedColumn = index >= Math.max(headers.length - 2, 0);
                                    const isLastColumn = index === headers.length - 1;
                                    const isLastSecondColumn = index === headers.length - 2;
                                    return (
                                        <TableCell
                                            key={index}
                                            sx={getHeaderCellStyle(isFirstColumn, isLastFixedColumn, index, headers.length, isLastColumn, isLastSecondColumn)}
                                        >
                                            {isLastColumn ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                    <Box>{header}</Box>
                                                    {hiddenColumnsCount > 0 && (
                                                        <Tooltip
                                                            title={t("materials.buttons.missingColumnsTooltip", { count: hiddenColumnsCount + 2 })}
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={scrollToLastColumn}
                                                                    sx={{
                                                                        minWidth: 'auto',
                                                                        padding: '2px 8px',
                                                                        fontSize: '10px',
                                                                        textTransform: 'none',
                                                                        borderColor: secondColor(600),
                                                                        backgroundColor: secondColor(600),
                                                                        color: "#FFF",
                                                                        fontWeight: 600,
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: "2px",
                                                                        '&:hover': {
                                                                            borderColor: secondColor(600),
                                                                            backgroundColor: secondColor(600),
                                                                            color: "#FFF",
                                                                        },
                                                                    }}
                                                                >
                                                                    {t("materials.sheetPaper.view")}
                                                                    <div>({hiddenColumnsCount + 2})</div>
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            ) : (
                                                header
                                            )}
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
                                            const isLastFixedColumn = cellIndex >= Math.max(headers.length - 2, 0);
                                            const isLastColumn = cellIndex === headers.length - 1;
                                            const isLastSecondColumn = cellIndex === headers.length - 2;
                                            const isFixedColumn = isFirstColumn || isLastFixedColumn;


                                            return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={isFixedColumn ? 'fixed-column' : ''}
                                                    sx={getBodyCellStyle(isFirstColumn, isLastFixedColumn, cellIndex, headers.length, isLastColumn, isLastSecondColumn)}
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
