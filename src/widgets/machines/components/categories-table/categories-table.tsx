import {styled} from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {EditIcon} from "@/components/icons/edit-icon";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {PrimaryButton} from "@/widgets/machines/components/buttons/primary-button";
import {useStyle} from "@/widgets/machines/components/categories-table/style";
import {GomakeTextInput} from "@/components";
import {useCallback, useState} from "react";
import {SecondaryButton} from "@/widgets/machines/components/buttons/secondary-button";
import AddIcon from '@mui/icons-material/Add';
import { ICategoriesTableProps } from "./interface";

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#EBECFF",
        color: "#292929",
        ...FONT_FAMILY.Lexend(500, 14),
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#2E3092",
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(even)": {
        backgroundColor: "#F6F6F6",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));


const CategoriesTable = ({isAdmin}: ICategoriesTableProps) => {
    const [filter, setFilter] = useState<string>('');
    const {primaryColor} = useGomakeTheme();
    const categoriesList = useRecoilValue(machineCategoriesState);
    const {classes} = useStyle();
    const categories = useCallback(() => {
        if (!!filter) {
            return categoriesList
                .filter((category) => category.name.toLowerCase().includes(filter.toLowerCase()));
        }
        return categoriesList
    }, [filter, categoriesList])

    return (
        <>
            <div style={classes.headerContainer}>
                <h1 style={classes.header}>Categories</h1>
                <GomakeTextInput placeholder={'Category'} onChange={(e) => {
                    setFilter(e.target.value)
                }} style={classes.searchInput}/>
            </div>
            {
                !!isAdmin &&
                <SecondaryButton style={classes.addMachineBtn}
                                 variant={'contained'}
                                 href={`/admin/machine/add-machine`}
                                 startIcon={<AddIcon/>}>
                    Add Machine
                </SecondaryButton>
            }
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={"center"}>Category</StyledTableCell>
                            <StyledTableCell align={"center"}>
                                internal/Out source
                            </StyledTableCell>
                            <StyledTableCell align={"center"}>active</StyledTableCell>
                            <StyledTableCell align={"center"}>edit machine</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories().map((category) => {
                            return (
                                <StyledTableRow>
                                    <StyledTableCell align={"center"}>
                                        {category.name}
                                    </StyledTableCell>
                                    <StyledTableCell align={"center"}></StyledTableCell>
                                    <StyledTableCell align={"center"}></StyledTableCell>
                                    <StyledTableCell align={"center"}>
                                        <PrimaryButton
                                            startIcon={
                                                <EditIcon
                                                    color={primaryColor(500)}
                                                    width={20}
                                                    height={20}
                                                />
                                            }
                                            href={
                                            isAdmin ? `/admin/machine/category/${category.id}`
                                                : `/machines/category/${category.id}`
                                        }
                                            variant={"text"}
                                        >
                                            Edit
                                        </PrimaryButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export {CategoriesTable};
