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
import { DEPOSIT_TYPE } from "../enums";
import { useTranslation } from "react-i18next";


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
    deposit:any; 
}

const DepositTable = ({tableHeaders , tableRows ,deposit } : ITableProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const width = deposit?.depositType === DEPOSIT_TYPE.Checks ? "28.57%" : "25%";
    const direction = t('direction');
    const footerDirection = direction === "ltr" ? "rtl" : "ltr"

    return (
        <div>
            <TableContainer style={{ maxHeight: 420, overflow: "scroll", border: "1px solid #EAECF0" }} >
                <Table stickyHeader={true}>
                    <TableHead>
                        <TableRow style={classes.tableRowStyle}>
                            {tableHeaders.map((header, index) => (
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
                                        cells={Object.values(item)}  
                                        index={index}
                                    />
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div dir={footerDirection}>
           <TotalPricesDeposits amountForDeposit={tableRows?.length} totalDeposit={deposit?.cashAmount} footerWith={width} footerDirection={direction}/>
           </div>
        </div>
    );
};

export { DepositTable };