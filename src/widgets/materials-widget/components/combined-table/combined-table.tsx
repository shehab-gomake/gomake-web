import React, { useState, useRef, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openChildTableState, openJobsModalState, openAddSupplierModalState } from "../../state";
import { useTranslation } from "react-i18next";
import { JobsModal } from "../jobs-modal/jobs-modal";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChildTableRow } from "../child-table-row/child-table-row";
import { ChevronRight } from "@mui/icons-material";


interface ICombinedTableProps {
    headers: any[];
    rows: any[];
}

const CombinedTable = ({
    headers,
    rows,
}: ICombinedTableProps) => {
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
            <Box sx={{ position: 'relative', width: '100%' }}>
                <TableContainer
                    ref={tableContainerRef}
                    component={Paper}
                    sx={{
                        maxHeight: 800,
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
                    <Table sx={{ width: '100%', tableLayout: 'auto' }} stickyHeader>
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor: '#EBECFF',
                                position: 'sticky',
                                top: 0,
                                zIndex: 100
                            }}>
                                {headers?.map((header, index) => {
                                    const isFirstColumn = index === 0;
                                    const isLastFixedColumn = index >= Math.max(headers.length - 3, 0); // Last 3 columns
                                    return (
                                        <TableCell
                                            key={index}
                                            sx={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                padding: '4px',
                                                backgroundColor: isLastFixedColumn ? '#D5D7FF' : '#EBECFF', // Only last 3 columns get different bg
                                                minWidth: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
                                                width: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
                                                ...(isFirstColumn && {
                                                    position: "sticky",
                                                    left: 0,
                                                    zIndex: 110,
                                                }),
                                                ...(isLastFixedColumn && {
                                                    position: 'sticky',
                                                    right: (headers.length - 1 - index) * 123,
                                                    zIndex: 105,
                                                    boxShadow: index === headers.length && '-4px 0 8px rgba(0,0,0,0.15), -2px 0 4px rgba(0,0,0,0.1)',
                                                    borderLeft: index === headers.length - 3 ? '2px solid rgba(0,0,0,0.15)' : 'none'
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
                            {rows?.map((row, rowIndex) => (
                                <React.Fragment key={rowIndex}>
                                    <TableRow sx={{
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa',
                                            '& .MuiTableCell-root.fixed-column': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }
                                    }}>
                                        {row.cells?.map((cell, cellIndex) => {
                                            const isFirstColumn = cellIndex === 0;
                                            const isLastFixedColumn = cellIndex >= Math.max(headers.length - 3, 0);
                                            const isFixedColumn = isFirstColumn || isLastFixedColumn;


                                            return (
                                                <TableCell
                                                    key={cellIndex}
                                                    className={isFixedColumn ? 'fixed-column' : ''}
                                                    sx={{
                                                        textAlign: 'center',
                                                        padding: '12px 8px',
                                                        whiteSpace: 'nowrap',
                                                        minWidth: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
                                                        width: isFirstColumn ? '50px' : isLastFixedColumn ? '123px' : 'auto',
                                                        borderBottom: '1px solid #e0e0e0',
                                                        position: 'relative',
                                                        ...(isFirstColumn && {
                                                            position: 'sticky',
                                                            left: 0,
                                                            zIndex: 5,
                                                            backgroundColor: '#fff',
                                                        }),
                                                        ...(isLastFixedColumn && {
                                                            position: 'sticky',
                                                            right: (headers.length - 1 - cellIndex) * 123,
                                                            zIndex: 5,
                                                            backgroundColor: '#fff',
                                                            boxShadow: cellIndex === headers.length && '-4px 0 8px rgba(0,0,0,0.15), -2px 0 4px rgba(0,0,0,0.1)',
                                                            borderLeft: cellIndex === headers.length - 3 ? '2px solid rgba(0,0,0,0.15)' : 'none'
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

                {/* Scroll Indicator Button - positioned at first fixed column */}
                {showScrollIndicator && (
                    <Tooltip title="Scroll to see more columns" arrow>
                        <IconButton
                            onClick={scrollToRight}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: `${3 * 121}px`, // Position at the start of fixed columns
                                transform: 'translateY(-50%)',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                width: '32px',
                                height: '32px',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                zIndex: 1000,
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(-50%) scale(0.95)',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '@keyframes pulse': {
                                    '0%': {
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                    },
                                    '50%': {
                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)'
                                    },
                                    '100%': {
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                    }
                                },
                                animation: 'pulse 2s ease-in-out infinite'
                            }}
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
