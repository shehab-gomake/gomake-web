import {styled} from "@mui/material/styles";
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";

import Link from "next/link";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import Button from "@mui/material/Button";
import {EditIcon} from "@/components/icons/edit-icon";


const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#EBECFF',
        color: '#292929',
        ...FONT_FAMILY.Lexend(500, 14)
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: '#2E3092',

    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#F6F6F6',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const CategoriesTable = () => {
    const categoriesList = useRecoilValue(machineCategoriesState);
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={'center'}>Category</StyledTableCell>
                            <StyledTableCell align={'center'}>internal/Out source</StyledTableCell>
                            <StyledTableCell align={'center'}>active</StyledTableCell>
                            <StyledTableCell align={'center'}>edit machine</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            categoriesList.map((category) => {
                                return <StyledTableRow>
                                    <StyledTableCell align={'center'}>{category.name}</StyledTableCell>
                                    <StyledTableCell align={'center'}></StyledTableCell>
                                    <StyledTableCell align={'center'}></StyledTableCell>
                                    <StyledTableCell align={'center'}>
                                        <Button component={Link} href={`/machines/category/${category.id}`} variant={'text'}>
                                            <EditIcon/>Edit</Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
export {CategoriesTable};