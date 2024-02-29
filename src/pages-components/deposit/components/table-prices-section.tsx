import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { useStyle } from "../style";
import { RowMappingWidget } from "./row-mapping";

const DepositTable = ({tableHeaders , tableRows , PrimaryTableCell} : any) => {
    const { classes } = useStyle();

    return (
        <div>
            <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }} >
                <Table stickyHeader={true}>
                    <TableHead>
                        <TableRow style={classes.tableRowStyle}>
                            {tableHeaders.map((header, index) => (
                                <PrimaryTableCell
                                    key={index}
                                    style={{ ...classes.tableHeaderStyle, width: "50%"}}>
                                    {header}
                                </PrimaryTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: "1px solid #EAECF0" }}>
                        {tableRows?.map((item: any, index: number) => {
                            return (
                                <>
                                    <RowMappingWidget
                                        key={item.id}
                                        item={item}
                                        index={index}
                                    />
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* {isNewReceipt ?  
                <TotalPricesNewReceipts sum={totalSum} totalPayment={finalTotalPayment} taxDeduction={taxDeduction} /> :
                <TotalPricesReceipts receiptItemValue={documentItemValue} />} */}
        </div>
    );
};

export { DepositTable };