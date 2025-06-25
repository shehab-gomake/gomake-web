import { Autocomplete, Box, Select, Typography } from "@mui/material";
import { useStyle } from "./style";
import { VatReportHeaderWidgetProps } from "./use-header-widget";

const VatReportHeaderWidget = ({
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    isFetchingCustomers,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    detailedReport,
    onChangeDetailedReport,
    vatReportByCreationDate,
    onChangeVatReportByCreationDate,
    onChangeByReferenceDate,
    handleDateChange,
    fromDate,
    toDate,
    isPurchaseReport,
    setFromDate,
    setToDate,
}: VatReportHeaderWidgetProps) => {
    const { classes } = useStyle();

    return (
        <Box style={classes.mainContainer}>
            <Box style={classes.firstRow}>
                <Box style={classes.dateContainer}>
                    <Typography style={classes.dateLabel}>
                        {isPurchaseReport ? "Supplier" : "Customer"}
                    </Typography>
                    {/* <Autocomplete
                        options={renderOptions()}
                        value={customer}
                        onChange={handleCustomerChange}
                        placeholder={
                            isPurchaseReport
                                ? "Select supplier..."
                                : "Select customer..."
                        }
                        loading={isFetchingCustomers}
                        style={classes.autoComplete}
                    /> */}
                </Box>

                <Box style={classes.dateContainer}>
                    <Typography style={classes.dateLabel}>Agent</Typography>
                    {/* <Select
                        options={agentsCategories}
                        value={agent}
                        onChange={handleAgentChange}
                        placeholder="Select agent..."
                        style={classes.select}
                    /> */}
                </Box>

                <Box style={classes.dateContainer}>
                    <Typography style={classes.dateLabel}>Date Range</Typography>
                    {/* <DatePicker
                        value={[fromDate, toDate]}
                        onChange={handleDateChange}
                        style={classes.datePicker}
                    /> */}
                </Box>

                <Box style={classes.dateContainer}>
                    <Typography style={classes.dateLabel}>Reference Date</Typography>
                    <input
                        type="date"
                        ref={dateRef}
                        value={selectDate}
                        onChange={(e) => setSelectDate(e.target.value)}
                        style={classes.dateInput}
                    />
                </Box>
            </Box>

            {/* <Box style={classes.secondRow}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={detailedReport}
                            onChange={onChangeDetailedReport}
                        />
                    }
                    label="Detailed Report"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={vatReportByCreationDate}
                            onChange={onChangeVatReportByCreationDate}
                        />
                    }
                    label="By Creation Date"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={false}
                            onChange={onChangeByReferenceDate}
                        />
                    }
                    label="By Reference Date"
                />
            </Box> */}
        </Box>
    );
};

export { VatReportHeaderWidget }; 