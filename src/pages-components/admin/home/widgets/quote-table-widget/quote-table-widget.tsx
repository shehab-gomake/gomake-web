import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuoteTableWidget } from "./use-quote-table-widget";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const QuoteTableWidget = ({ isAdmin = true }) => {
    const { classes } = useStyle();
    const { tableHeaders, tableRows, rows } = useQuoteTableWidget();
    const { t } = useTranslation();


    return (

        <div style={classes.mainContainer}>
            {/* <Stack direction={"row"} justifyContent={'space-between'} width={'100%'}>
                <div style={classes.buttonsContainerStyle} >
                    <SecondaryButton variant="contained" style={classes.buttonStyle}>Quotes</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Orders</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Items</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Delivery</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Invoice</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Recipt</SecondaryButton>
                </div>
                <SecondaryButton variant="contained" style={classes.addNewStyle}>Add new</SecondaryButton>
            </Stack> */}
            {/* <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={false}
                rows={tableRows}
                headers={tableHeaders}
            /> */}
            <TableContainer component={Paper} style={{ padding: "20px"}}>
            <Stack direction={"row"} justifyContent={'space-between'} width={'100%'}>
                <div style={classes.buttonsContainerStyle} >
                    <SecondaryButton variant="contained" style={classes.buttonStyle}>Quotes</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Orders</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Items</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Delivery</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Invoice</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Receipt</SecondaryButton>
                </div>
                <SecondaryButton variant="contained" style={classes.addNewStyle}>Add new</SecondaryButton>
            </Stack>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: "#B5B7C0" }}>{t("offer number")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("client type")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("job name")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("Production Date")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("final price")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("Status")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="center">{t("remark")}</TableCell>
                            <TableCell style={{ color: "#B5B7C0" }} align="right">{t("more")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.clientType}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell style={classes.dataRowStyle}>{row.offerNumber}</TableCell>
                                <TableCell style={classes.dataRowStyle} align="center">{row.clientType}</TableCell>
                                <TableCell style={classes.dataRowStyle} align="center">{row.jobName}</TableCell>
                                <TableCell style={classes.dataRowStyle} align="center">{row.product}</TableCell>
                                <TableCell style={classes.dataRowStyle} align="center">{row.finalPrice}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell style={classes.dataRowStyle} align="center">{row.remark}</TableCell>
                                <TableCell align="right">{row.more}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
};

export { QuoteTableWidget };
