import { useTranslation } from "react-i18next";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStyle } from "./style";
import { useWallTableWidget } from "./use-g-wall-table";
import { Checkbox, Stack } from "@mui/material";
import { GoMakeModal } from "@/components";
import { useRecoilState } from "recoil";
import { blockModalState, partnerInfoModalState } from "../states";
import { SecondaryButton } from "@/components/button/secondary-button";
import Drawer from '@mui/material/Drawer';
import React from "react";

const WallTableWidget = () => {
    const { classes } = useStyle();
    const { rows , list } = useWallTableWidget();
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useRecoilState<boolean>(blockModalState);
    const [openPartnerModal, setOpenPartnerModal] = useRecoilState<boolean>(partnerInfoModalState);

    return (
        <TableContainer component={Paper} style={{ width: "99%" }} >
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell style={classes.headersStyle} align="center" >{t("partners.headers.id")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.partners")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.quoteNumber")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.view")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.response")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.totalProducts")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.totalQuotes")}</TableCell>
                        <TableCell style={classes.headersStyle} align="center">{t("partners.headers.successRate")}</TableCell>
                        <TableCell style={classes.headersStyle} align="right">{t("partners.headers.more")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={classes.tableStyle}>
                    {rows.map((row) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell style={classes.headersStyle} align="center"><Checkbox color="primary" inputProps={{ 'aria-label': 'select all desserts', }} />{row.id}</TableCell>
                            <TableCell style={classes.headersStyle} align="center">{row.partner}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.quoteNumber}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.response}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.view}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.totalProducts}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.totalQuotes}</TableCell>
                            <TableCell style={classes.dataRowStyle} align="center">{row.successRate}</TableCell>
                            <TableCell align="right">{row.more}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <GoMakeModal
                openModal={openModal}
                modalTitle={t("partners.blockPrintingHouse")}
                onClose={() => setOpenModal(false)}
                insideStyle={classes.insideStyle}
                isBlockModal={true}>
                <Stack direction={"column"} gap={"30px"} marginTop={"10px"}>
                    <h4>{t("partners.Are you sure that you want to block this printing house from your partner list?")}</h4>
                    <Stack direction={"row"} gap={"10px"} justifyContent={"flex-end"}>
                        <SecondaryButton style={classes.cancelBtnStyle} variant="outlined" onClick={() => setOpenModal(false)}>{t("partners.cancel")}</SecondaryButton>
                        <SecondaryButton style={classes.blockBtnStyle} variant="contained">{t("partners.block")}</SecondaryButton>
                    </Stack>
                </Stack>
            </GoMakeModal>
            <div >
                {(['right'] as const).map((anchor) => (
                    <React.Fragment key={anchor} >
                        <Drawer
                            anchor={anchor}
                            open={openPartnerModal}
                            onClose={() => setOpenPartnerModal(false)}
                        >
                            {list(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
            </div>
        </TableContainer>
    )
};
export { WallTableWidget };