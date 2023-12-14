import {styled} from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {ISecondaryTableProps} from "@/components/tables/interface";
import {useStyle} from "@/components/tables/style";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useTranslation} from "react-i18next";
import {useCallback, useRef, useState, UIEvent, useLayoutEffect} from "react";

const SecondaryTableCell = styled(TableCell)(() => {
    const {primaryColor} = useGomakeTheme();
    return {
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#F6F6F6',
            color: primaryColor(800),
            ...FONT_FAMILY.Lexend(500, 14),
            padding: '5px 5px',
            height: 50
        },
        [`&.${tableCellClasses.body}`]: {
            ...FONT_FAMILY.Lexend(500, 14),
            color: primaryColor(800),
            padding: '3px 0',
            border: 0,
            height: 38

        },
    }
});

const SecondaryTableRow = styled(TableRow)((props: { checked: boolean }) => {
    const {primaryColor} = useGomakeTheme();
    return {
        borderBottom: '1px solid #DBDBDB',
        backgroundColor: !!props?.checked ? primaryColor(100) : 'unset'
    }
});


const SecondaryTable = ({
                            rows,
                            headers,
                            stickyHeader,
                            stickyFirstCol,
                            maxHeight,
                            onScrolledBottom
                        }: ISecondaryTableProps) => {
    const {t} = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    const {classes} = useStyle(maxHeight, dir);
    const tableEl = useRef<HTMLDivElement>();
    const [distanceBottom, setDistanceBottom] = useState<number>()
    const [hasMore] = useState(true)
    const scrollListener = useCallback(() => {
        let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight
        if (!distanceBottom) {
            setDistanceBottom(Math.round(bottom * 0.2))
        }
        if (tableEl.current.scrollTop > bottom - distanceBottom) {
            onScrolledBottom()
        }
    }, [hasMore, distanceBottom])

    useLayoutEffect(() => {
        const tableRef = tableEl.current
        if (tableRef) {
            tableRef.addEventListener('scroll', scrollListener)
            return () => {
                tableRef?.removeEventListener('scroll', scrollListener)
            }
        }
    }, [scrollListener])

    const handelTableScroll = (e: UIEvent<HTMLDivElement>) => {
        // let bottom = e.target.scrollHeight - tableEl.current.clientHeight
        let bottom = e.currentTarget.scrollHeight - e.currentTarget.clientHeight
        if (!distanceBottom) {
            setDistanceBottom(Math.round(bottom * 0.2))
        }
        if (tableEl.current.scrollTop > bottom - distanceBottom) {
            onScrolledBottom()
        }
    }

    return (
        <TableContainer onScroll={handelTableScroll}
                        style={{...classes.tableContainer}}
                        ref={tableEl}>
            <Table stickyHeader={true}>
                <TableHead>
                    <SecondaryTableRow checked={false}>
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
                        {rows?.map((row, i) => (
                                <SecondaryTableRow key={'table-row' + i} checked={row.checked}>
                                    {
                                        row.values.map((cell, index) => {
                                            if (index === 0 && stickyFirstCol) {
                                                return <SecondaryTableCell key={'table-cell' + index} style={classes.sticky}>
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