import { Stack } from "@mui/material";
import { useDeposits } from "./use-deposits";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { useStyle } from "./style";
import { DepositsHeaderSection } from "./components/header-section";
import { DepositsFiltersWidget } from "./components/filters-section";
import { useEffect } from "react";

const DepositsListPageWidget = () => {
    const { classes } = useStyle();
    const {
        page,
        setPage,
        pagesCount,
        pageSize,
        handlePageSizeChange,
        tableHeaders,
        getAgentCategories,
        setAgentsCategories,
        setEmployeeListValue,
        getAllDeposits,
        allDeposits
    } = useDeposits();

    useEffect(() => {
        getAllDeposits();
        getAgentCategories(true, setAgentsCategories);
        getAgentCategories(null, setEmployeeListValue);
    }, []);


    useEffect(() => {
        getAllDeposits();
    }, [page, pageSize]);

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
                    <DepositsFiltersWidget />
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
            </Stack>

        </>
    );
};

export { DepositsListPageWidget };
