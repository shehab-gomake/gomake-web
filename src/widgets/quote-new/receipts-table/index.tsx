import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Checkbox,
    TableRow
} from "@mui/material";
import { useStyle } from "./style";
import { RowMappingWidget } from "./row-mapping";
import { usePaymentsTable } from "./use-payments-table";
import { TotalPricesNewReceipts } from "./total-prices-new-receipt";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { TotalPricesReceipts } from "./total-prices-receipt";

const ReceiptsTable = () => {
    let indexs = 0;
    const headerHeight = "44px";
    const { classes } = useStyle({ headerHeight });
    const { isNewReceipt, documentItemValue, tableHeaders, tableRows, columnWidths, PrimaryTableCell, checkedItems, handleCheckboxChange, totalSum, finalTotalPayment, taxDeduction } = usePaymentsTable();

    return (
        <div>
            {/* <div>
                <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                    checked={selectAllChecked}
                    onChange={handleSelectAllCheckboxChange}
                />
                Select All
            </div> */}
            <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }} >
                <Table stickyHeader={true}>
                    <TableHead>
                        <TableRow style={classes.tableRowStyle}>
                            {tableHeaders.map((header, index) => (
                                <PrimaryTableCell
                                    key={index}
                                    style={{ ...classes.tableHeaderStyle, width: columnWidths[index] }}>
                                    {header}
                                </PrimaryTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: "1px solid #EAECF0" }}>
                        {tableRows?.map((item: any, index: number) => {
                            indexs++;
                            return (
                                <>
                                    <RowMappingWidget
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        columnWidths={columnWidths}
                                        headerHeight={headerHeight}
                                        isChecked={checkedItems[index]}
                                        onCheckboxChange={() => {
                                            handleCheckboxChange(index, item?.id);
                                        }}

                                    //     onCheckboxChange={handleCheckboxChange.bind(null, index)}

                                    />
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {isNewReceipt ?  
                <TotalPricesNewReceipts sum={totalSum} totalPayment={finalTotalPayment} taxDeduction={taxDeduction} /> :
                <TotalPricesReceipts receiptItemValue={documentItemValue} />}
        </div>
    );
};

export { ReceiptsTable };