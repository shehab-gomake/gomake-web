import { Stack } from "@mui/material";
import { useDeposits } from "./use-deposits";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { useStyle } from "./style";
import { DepositsHeaderSection } from "./components/header-section";
import { DepositsFiltersWidget } from "./components/filters-section";
import { useEffect, useState } from "react";
import { GoMakeModal } from "@/components";
import { DocumentLogsWidget } from "../quotes/widgets/documents-logs-widget/logs-widget";
import { useAgentsList } from "@/hooks/use-agent-list";

const DepositsListPageWidget = () => {
    const { classes } = useStyle();
    const { agentsCategories, getAgentCategories } = useAgentsList()
    const {
        page,
        setPage,
        pagesCount,
        pageSize,
        handlePageSizeChange,
        tableHeaders,
        getAllDeposits,
        allDeposits,
        finalPatternSearch,
        handleSearchChange,
        openLogsModal,
        onClickCloseLogsModal,
        logsTableHeaders,
        depositLogTitle,
        handleSelectEmployee,
        employeeId,
        onSelectLogsDateRange,
        resetLogsDatePicker
    } = useDeposits();

    useEffect(() => {
        getAllDeposits();
    }, [page, pageSize, finalPatternSearch]);

    useEffect(() => {
        getAgentCategories(null);
    }, [])

    return (
        <>
            <Stack
                direction="column"
                justifyContent="space-between"
                display="flex"
                spacing={2}
                height="100%"
            >
                <div style={classes.mainContainer}>
                    <DepositsHeaderSection />
                    <DepositsFiltersWidget onClickSearch={handleSearchChange} />
                    <PrimaryTable
                        stickyFirstCol={false}
                        stickyHeader={true}
                        maxHeight={650}
                        rows={allDeposits}
                        headers={tableHeaders}
                    />
                </div>
                <GoMakePagination
                    onChangePageNumber={(event, value) => setPage(value)}
                    onChangePageSize={handlePageSizeChange}
                    page={page}
                    setPage={setPage}
                    pagesCount={pagesCount}
                    pageSize={pageSize}
                />
                <GoMakeModal
                    insideStyle={classes.insideStyle}
                    openModal={openLogsModal}
                    onClose={onClickCloseLogsModal}
                    modalTitle={depositLogTitle}
                >
                    <DocumentLogsWidget
                        logsTableHeaders={logsTableHeaders}
                        logsTableRows={null}
                        employeeId={employeeId}
                        handleSelectEmployee={handleSelectEmployee}
                        onSelectDateRange={onSelectLogsDateRange}
                        resetLogsDatePicker={resetLogsDatePicker}
                        employeesCategories={agentsCategories}
                    />
                </GoMakeModal>
            </Stack>
        </>
    );
};

export { DepositsListPageWidget };
