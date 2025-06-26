import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageLogs } from "./use-message-logs";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeAutoComplate } from "@/components";
import { Stack } from "@mui/material";

const MessageLogs = () => {
  const {
    tableHeaders,
    mailLogsTableRows,
    totalCount,
    pageNumber,
    pageSize,
    setPageNumber,
    handlePageSizeChange,
    handlePageNumberChange,
    patternSearch,
    handleSearchChange,
    templateType,
    templateTypeOptions,
    handleTemplateTypeChange,
    users,
    handleUserChange,
    userId,
    listClient,
    handleCustomerChange,
    clientId
  } = useMessageLogs();

  return (
    <div style={{ position: "relative" }}>
      <Stack direction="column" gap="20px" paddingBottom="20px">
        <Stack direction="row" gap="20px" alignItems="center">
          <SearchInputComponent
            onChange={handleSearchChange}
            value={patternSearch}
            placeHolder="Search "
            searchInputStyle={{ width: "200px" }}
          />
          <GoMakeAutoComplate
            options={templateTypeOptions}
            style={{ width: "200px" }}
            getOptionLabel={(option: any) => option.label}
            placeholder="Select template type"
            onChange={handleTemplateTypeChange}
            value={templateTypeOptions.find(option => option.value === templateType) || null}
          />
          <GoMakeAutoComplate
            options={users}
            style={{ width: "200px" }}
            getOptionLabel={(option: any) => option.firstname + " " + option.lastname}
            placeholder="Select user"
            onChange={handleUserChange}
            value={users.find(option => option.id === userId) || null}
          />
          <GoMakeAutoComplate
            options={listClient}
            style={{ width: "200px" }}
            getOptionLabel={(option: any) => option.name}
            placeholder="Select client"
            onChange={handleCustomerChange}
            value={listClient.find(option => option.id === clientId) || null}
          />
          {/* <ClientAutocomplete
            key={customer?.id}
            options={renderOptions()}
            onChangeTextField={checkWhatRenderArray}
            getOptionLabel={(option: any) => `${option.name}`}
            style={{ width: "200px" }}
            onChange={handleCustomerChange}
            value={customer}
            loading={isFetching}
          /> */}
        </Stack>
      </Stack>

      <PrimaryTable
        stickyHeader={true}
        rows={mailLogsTableRows}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 280px)"}
      />
      <GoMakePagination
        onChangePageNumber={handlePageNumberChange}
        onChangePageSize={handlePageSizeChange}
        page={pageNumber}
        setPage={setPageNumber}
        pagesCount={totalCount}
        pageSize={pageSize}
        initialPageSize={10}
      />
    </div>
  );
};

export { MessageLogs };
