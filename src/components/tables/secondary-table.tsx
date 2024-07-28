import {styled} from "@mui/material/styles";
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {ISecondaryTableProps} from "@/components/tables/interface";
import {useStyle} from "@/components/tables/style";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useTranslation} from "react-i18next";

const SecondaryTableCell = styled(TableCell)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#FCFCFC',
            color: primaryColor(800),
            ...FONT_FAMILY.Lexend(600, 14),
            padding: '5px 5px',
            height: 50
        },
        [`&.${tableCellClasses.body}`]: {
            ...FONT_FAMILY.Lexend(500, 14),
            color: primaryColor(800),
            padding: '3px 0',
            border: 0,
            height: 38,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #DBDBDB',

        },
    }
});

const SecondaryTableRow = styled(TableRow)(() => {
    return {
        // backgroundColor: bgColor,
    }
});


const SecondaryTable = ({
                            rows,
                            headers,
                            stickyHeader,
                            stickyFirstCol,
                            maxHeight,
                        }: ISecondaryTableProps) => {
    const {t} = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    const {classes} = useStyle(maxHeight, dir);
    return (
        <TableContainer style={{margin: 'auto', height: 'fit-content',  maxHeight: '800px', ...classes.tableContainer}}>
            <Table stickyHeader={false}>
                <TableHead>
                    <SecondaryTableRow>
                        {
                            headers?.map((header, index) => {
                                if (index === 0 && stickyHeader) {
                                    return <SecondaryTableCell style={classes.stickyHeader}>
                                        {header}
                                    </SecondaryTableCell>
                                } else {
                                    return <SecondaryTableCell align={"center"}>{header}</SecondaryTableCell>
                                }
                            })
                        }
                    </SecondaryTableRow>
                </TableHead>
                <TableBody>
                    {rows?.map((row) => (
                        <SecondaryTableRow>
                            {
                                row?.map((cell, index) => {
                                    if (index === 0 && stickyFirstCol) {
                                        return <SecondaryTableCell style={classes.sticky}>
                                            {cell}
                                        </SecondaryTableCell>
                                    } else {
                                        return <SecondaryTableCell align={"center"}>{cell}</SecondaryTableCell>
                                    }
                                })
                            }
                        </SecondaryTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export {SecondaryTable, SecondaryTableRow, SecondaryTableCell}