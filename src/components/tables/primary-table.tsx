import {styled} from "@mui/material/styles";
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {ITableProps} from "@/components/tables/interface";
import {useStyle} from "@/components/tables/style";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const PrimaryTableCell = styled(TableCell)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: primaryColor(50),
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 14),
        padding: '5px 5px',
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
        padding: '2px 0',
    },
}});

const PrimaryTableRow = styled(TableRow)(() => {
    const {neutralColor} = useGomakeTheme();
    return {
        "&:nth-of-type(even)": {
        backgroundColor: neutralColor(100),
    },
        // hide last border
        "&:last-child td, &:last-child th": {
        border: 0,
    },
    }
});

const PrimaryTable = ({rows, headers, stickyHeader, stickyFirstCol, maxHeight}: ITableProps) => {
    const {classes} = useStyle(maxHeight);
    return (
        <TableContainer style={classes.tableContainer}>
            <Table  stickyHeader={stickyHeader}>
                <TableHead>
                    <PrimaryTableRow>
                        {
                            headers?.map((header, index) => {
                                if (index === 0 && stickyHeader) {
                                    return <PrimaryTableCell  style={classes.stickyHeader}>
                                        {header}
                                    </PrimaryTableCell>
                                } else {
                                    return <PrimaryTableCell align={"center"}>{header}</PrimaryTableCell>
                                }
                            })
                        }
                    </PrimaryTableRow>
                </TableHead>
                <TableBody>
                    {rows?.map((row) => (
                        <PrimaryTableRow>
                            {
                                row.map((cell, index) => {
                                    if (index === 0 && stickyFirstCol) {
                                        return <PrimaryTableCell  style={classes.sticky}>
                                            {cell}
                                        </PrimaryTableCell>
                                    } else {
                                        return <PrimaryTableCell align={"center"}>{cell}</PrimaryTableCell>
                                    }
                                })
                            }
                        </PrimaryTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export {PrimaryTable, PrimaryTableCell, PrimaryTableRow}