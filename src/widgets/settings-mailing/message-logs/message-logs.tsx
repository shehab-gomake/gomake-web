import { PrimaryTable } from "@/components/tables/primary-table";
import { useMessageLogs } from "./use-message-logs";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { GoMakeAutoComplate } from "@/components";
import { Stack } from "@mui/material";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useCustomerDropDownList } from "@/hooks";
import { CLIENT_TYPE } from "@/pages/customers/enums";

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
    customerId,
    setCustomerId,
    primaryColor,
     secondColor
  } = useMessageLogs();
  const { renderOptions, checkWhatRenderArray, isFetching } =
    useCustomerDropDownList({
      clientType: CLIENT_TYPE.All
    });

  return (
    <div style={{ position: "relative", padding: 20 }}>
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
            placeholder="Select employee"
            onChange={handleUserChange}
            value={users.find(option => option.id === userId) || null}
          />
            <ClientAutocomplete
              key={customerId?.id}
              clientType={CLIENT_TYPE.All}
              options={renderOptions() ? renderOptions() : []}
              getOptionLabel={(option: any) =>
                `${option.name}`
              }
              onChangeTextField={checkWhatRenderArray}
              style={{ border: "none" ,minWidth: "fit-content",
                width: "200px",            borderBottom: customerId?.id ? `2px solid ${primaryColor(500)}` : `2px solid ${secondColor(500)}`, 
              }}
              onChange={(e: any, value: any) => {
                setCustomerId(value);
              }}
              value={customerId}
              loading={isFetching}
            />
        </Stack>
      </Stack>

      <PrimaryTable
        stickyHeader={true}
        rows={mailLogsTableRows}
        headers={tableHeaders}
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
