import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import { GoMakeAutoComplate } from "@/components";
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
const QuotesListPageWidget = () => {
  const { clasess } = useStyle();
  const {
    tableHeaders,
    allQuotes,
    quoteStatuses,
    setPatternSearch,
    setStatusId,
    setCustomerId,
    renderOptions,
    checkWhatRenderArray,
    t,
  } = useQuotes();
  return (
    <>
      <HeaderTitleWithSearch
        title="Qoute List"
        onChange={(e) => setPatternSearch(e)}
      />
      <div style={clasess.mainContainer}>
        <div style={clasess.filtersContainer}>
          <div style={clasess.statusFilterContainer}>
            <GoMakeAutoComplate
              options={quoteStatuses}
              style={clasess.textInputStyle}
              placeholder={"filter by status"}
              onChange={(e: any, value: any) => {
                setStatusId(value?.value);
              }}
            />
          </div>
          <div style={clasess.statusFilterContainer}>
            <GoMakeAutoComplate
              options={renderOptions()}
              getOptionLabel={(option: any) => `${option.name}`}
              onChangeTextField={checkWhatRenderArray}
              style={clasess.textInputStyle}
              placeholder={"filter by customer"}
              onChange={(e: any, value: any) => {
                setCustomerId(value?.id);
              }}
            />
          </div>
          <div style={clasess.statusFilterContainer}>
            <GoMakeAutoComplate
              options={quoteStatuses}
              style={clasess.textInputStyle}
              placeholder={"filter by status"}
              onChange={(e: any, value: any) => {
                setStatusId(value?.value);
              }}
            />
          </div>
          {/* <DateRangePicker slots={{ field: SingleInputDateRangeField }} /> */}
        </div>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={allQuotes}
          headers={tableHeaders}
        />
      </div>
    </>
  );
};

export { QuotesListPageWidget };
