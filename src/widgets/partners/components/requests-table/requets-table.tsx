import { useTranslation } from "react-i18next";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStyle } from "./style";
import { Checkbox } from "@mui/material";
import { useRequestsTableWidget } from "./use-requests-table";

const RequestsTableWidget = () => {
    const { classes } = useStyle();
    const { rows } = useRequestsTableWidget();
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper} style={{ width: "99%" }} >
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell style={classes.headersStyle} align="center" >{t("partners.headers.id")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.name")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.logo")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.country")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.city")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.partnerType")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.status")}</TableCell>
                        <TableCell style={classes.headersStyle} align="right">{t("partners.headers.more")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={classes.tableStyle}>
                    {rows.map((row) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell style={classes.headersStyle} align="center"><Checkbox color="primary" inputProps={{ 'aria-label': 'select all desserts', }} />{row.id}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.name}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.logo}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.country}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.city}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.partnerType}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.status}</TableCell>
                            <TableCell align="right">{row.more}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};
export { RequestsTableWidget };