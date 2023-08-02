import { styled } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrimaryButton } from "@/widgets/machines/components/buttons/primary-button";
import { useStyle } from "@/widgets/properties/properties-table/style";
import { GomakeTextInput } from "@/components";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SecondaryButton } from "@/widgets/machines/components/buttons/secondary-button";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "../more-circle";
import { usePrintHouseActions } from "../hooks/use-print-house-action";
import { usePropertiesModals } from "../use-property-modals";
import { useProperty } from "../use-property";
import { propertyState } from "../property";


const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#",
        color: "#B5B7C0",
        ...FONT_FAMILY.Lexend(500, 14),
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#656572",
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(even)": {
        backgroundColor: "#FFFFFF",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const PropertiesTable = () => {
    const [filter, setFilter] = useState<string>('');
    const { primaryColor } = useGomakeTheme();
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { state } = usePrintHouseActions();
    const {onOpenAddNewModalRule, onCloseAddNewModalRule} = useProperty();
    const setPropertyState = useSetRecoilState<any>(propertyState);
    const properties = useCallback(() => {
        if (!!filter) {
            return state
                .filter((property) => property.propertyName.toLowerCase().includes(filter.toLowerCase()));
        }
        return state
    }, [filter, state])
    useEffect(() => {
        setPropertyState({
            onCloseAddNewModalRule,
            onOpenAddNewModalRule
        })
    })
    return (
        <>
            <div style={classes.headerContainer}>
                <h1 style={classes.header}>Action pricing properties</h1>
                <GomakeTextInput placeholder={'search'} onChange={(e) => {
                    setFilter(e.target.value)
                }} style={classes.searchInput} />
            </div>

            <TableContainer style={classes.shadowBorder}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={"center"}>{t("properties.parameter")}</StyledTableCell>
                            <StyledTableCell style={{ width: "25%" }} align={"center"}>
                                {t("properties.rule")}
                            </StyledTableCell>
                            <StyledTableCell align={"center"}>{t("properties.type")}</StyledTableCell>
                            <StyledTableCell align={"center"}>{t("properties.more")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties().map((property) => {
                            return (
                                <StyledTableRow>
                                    <StyledTableCell align={"center"}>
                                        {property.propertyName}
                                    </StyledTableCell>
                                    <StyledTableCell align={"center"}>
                                        {property.actionRules.map((rule,index)=>{
                                            return(
                                                <div className="scrollBlue" style={classes.rowItem}>
                                                {index+ 1}- {rule.expression}
                                            </div>
                                            )
                                        } )}

                                    </StyledTableCell>
                                        <StyledTableCell align={"center"}>{property.ruleType == 0? 'Output': 'Input'} </StyledTableCell>
                                    <StyledTableCell align={"center"}>
                                        <MoreMenuWidget />
                                    </StyledTableCell>
                                </StyledTableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export { PropertiesTable };