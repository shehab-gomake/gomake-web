import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useQuoteTableWidget } from "./use-quote-table-widget";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack, Tab, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const QuoteTableWidget = ({ isAdmin = true }) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { primaryColor, secondColor } = useGomakeTheme();
    const { theme, tabLabels, quoteRows, orderRows, itemRows, deliveryRows, invoiceRows, receiptRows } = useQuoteTableWidget();
    const [selectedTab, setSelectedTab] = useState(0);
    const [tableRow, setTableRow] = useState<any>(quoteRows);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        let newRows;

        if (selectedTab === 0) {
            newRows = quoteRows;
        } else if (selectedTab === 1) {
            newRows = orderRows;
        } else if (selectedTab === 2) {
            newRows = itemRows;
        } else if (selectedTab === 3) {
            newRows = deliveryRows;
        } else if (selectedTab === 4) {
            newRows = invoiceRows;
        } else {
            newRows = receiptRows;
        }
        setTableRow(newRows);
    }, [selectedTab]);

    return (
        <div style={classes.mainContainer}>
            <TableContainer component={Paper} style={{ padding: "20px" }}>
                <Stack direction={"row"} justifyContent={'space-between'} width={'100%'}>
                    <ThemeProvider theme={theme}  >
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            textColor="secondary"
                            TabIndicatorProps={{ style: { display: 'none' } }}>
                            {tabLabels.map((label, index) => (
                                <Tab
                                    key={index}
                                    sx={{
                                        backgroundColor: selectedTab === index ? secondColor(500) : primaryColor(100),
                                        color: selectedTab === index ? '#FFFFFF' : primaryColor(700),
                                        minHeight: '0px',
                                        height: '30px',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        marginRight: '10px',
                                        textTransform: 'none',
                                        fontStyle: 'normal',
                                        ...FONT_FAMILY.Lexend(500, 16),
                                        lineHeight: 'normal',
                                        width: `${Math.min(label.length * 12, 150)}px`,
                                    }}
                                    label={label}
                                />
                            ))}
                        </Tabs>
                    </ThemeProvider>
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
                        {tableRow.map((row) => (
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
