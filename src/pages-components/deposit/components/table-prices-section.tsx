import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled,
    tableCellClasses
} from "@mui/material";
import { useStyle } from "../style";
import { RowMappingWidget } from "./row-mapping";
import { TotalPricesDeposits } from "./total-prices";


const PrimaryTableCell = styled(TableCell)(() => {
    return {
        [`&.${tableCellClasses.head}`]: {
            padding: 0,
        },
        [`&.${tableCellClasses.body}`]: {
            padding: 0,
        },
    };
});

interface ITableProps {
    tableHeaders:any;
    tableRows : any ;
    
}

const DepositTable = ({tableHeaders , tableRows } : ITableProps) => {
    const { classes } = useStyle();

    return (
        <div>
            <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }} >
                <Table stickyHeader={true}>
                    <TableHead>
                        <TableRow style={classes.tableRowStyle}>
                            {tableHeaders().map((header, index) => (
                                <PrimaryTableCell
                                    key={index}
                                    style={classes.tableHeaderStyle}>
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
           <TotalPricesDeposits amountForDeposit={"150"} totalDeposit={"200"}/>
        </div>
    );
};

export { DepositTable };