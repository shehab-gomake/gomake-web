import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DeleteMenuIcon } from "@/widgets/quote-new/more-circle/icons/delete-menu";
import { ScheduledReport } from "@/hooks/use-scheduled-reports";
import { useListPagination } from "@/hooks/use-list-pagination";

interface ScheduledReportsTableProps {
    openModal: boolean;
    onCloseModal: () => void;
    scheduledReports?: ScheduledReport[];
    totalCount?: number;
    pageNumber?: number;
    pageSize?: number;
    pagesCount?: number;
    isLoading?: boolean;
    onToggleActive?: (id: string, isActive: boolean) => void;
    onDelete?: (id: string) => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

const ScheduledReportsTable = ({
    openModal,
    onCloseModal,
    scheduledReports = [],
    totalCount = 0,
    pageNumber = 1,
    pageSize = 10,
    pagesCount = 1,
    isLoading = false,
    onToggleActive,
    onDelete,
    onPageChange,
    onPageSizeChange,
}: ScheduledReportsTableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { initialPageSize } = useListPagination();

    const headers = [
        t("sales.list.reportName"),
        t("sales.list.status"),
        t("sales.list.actions"),
    ];

    // Use pagesCount from props instead of recalculating
    console.log('ScheduledReportsTable pagination values:', {
        totalCount,
        pageNumber,
        pageSize,
        pagesCount,
        scheduledReportsLength: scheduledReports.length,
        shouldShowPagination: scheduledReports.length > 0,
        onPageChange: !!onPageChange,
        onPageSizeChange: !!onPageSizeChange
    });

    // Log when modal opens
    useEffect(() => {
        if (openModal) {
            console.log('Modal opened with data:', {
                scheduledReports: scheduledReports.length,
                totalCount,
                pagesCount,
                pageSize,
                shouldShowPagination: scheduledReports.length > 0 && pagesCount > 0
            });
        }
    }, [openModal, scheduledReports.length, totalCount, pagesCount, pageSize]);

    // Log when data changes
    useEffect(() => {
        console.log('Data changed:', {
            scheduledReports: scheduledReports.length,
            totalCount,
            pagesCount,
            pageSize,
            shouldShowPagination: scheduledReports.length > 0 && pagesCount > 0,
            firstReportName: scheduledReports[0]?.reportName,
            lastReportName: scheduledReports[scheduledReports.length - 1]?.reportName
        });
    }, [scheduledReports.length, totalCount, pagesCount, pageSize, scheduledReports]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        onPageChange?.(page);
    };

    const handlePageSizeChange = (event: any, child: React.ReactNode) => {
        onPageSizeChange?.(event.target.value as number);
    };

    const rows = (scheduledReports || []).map((report) => [
        report.reportName,
        <SecondSwitch
            key={`switch-${report.id}`}
            checked={report.isActive}
            onChange={(e) => onToggleActive?.(report.id, e.target.checked)}
        />,
        <div key={`actions-${report.id}`} style={{ ...classes.actionButtons, cursor: "pointer" }} onClick={() => {
            onDelete?.(report.id)
        }} >
            <DeleteMenuIcon />
        </div>,
    ]);

    return (
        <GoMakeModal
            openModal={openModal}
            onCloseModal={onCloseModal}
            modalTitle={t("sales.list.scheduledReports")}
            insideStyle={classes.insideStyle}
            withClose={false}
        >
            <div style={classes.mainContainer}>
                <div style={{ minHeight: "432px" }}>
                    <PrimaryTable
                        key={`scheduled-reports-table-${pageNumber}-${scheduledReports.length}`}
                        stickyHeader={true}
                        maxHeight={"300px"}
                        rows={rows}
                        headers={headers}
                        variant="OddEvenTable"
                    />
                    {scheduledReports.length > 0 && (
                        <div>
                            <GoMakePagination
                                onChangePageNumber={handlePageChange}
                                onChangePageSize={handlePageSizeChange}
                                page={pageNumber}
                                setPage={onPageChange || (() => { })}
                                pageSize={pageSize}
                                pagesCount={Math.max(pagesCount, 2)} // Force at least 2 pages for testing
                                initialPageSize={initialPageSize}
                            />
                        </div>
                    )}
                </div>
                <div style={classes.buttonContainer}>
                    <GomakePrimaryButton
                        style={classes.closeButton}
                        onClick={onCloseModal}
                    >
                        {t("modal.close")}
                    </GomakePrimaryButton>
                </div>
            </div>
        </GoMakeModal>
    );
};

export { ScheduledReportsTable };
