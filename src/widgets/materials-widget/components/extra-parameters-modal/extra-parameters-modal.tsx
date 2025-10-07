import React, { useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    openExtraParametersModalState,
    materialHeadersState,
} from "../../state";
import { useTranslation } from "react-i18next";
import { TableCellData } from "../table-cell-data/table-cell";
import { userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";

interface IExtraParametersModalProps {
    isAdmin: boolean;
}

const ExtraParametersModal = ({ isAdmin }: IExtraParametersModalProps) => {
    const { t } = useTranslation();
    const [openExtraParametersModal, setOpenExtraParametersModal] =
        useRecoilState(openExtraParametersModalState);
    const materialHeaders = useRecoilValue(materialHeadersState);
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0;

    const handleClose = () => {
        setOpenExtraParametersModal({ open: false });
    };

    // Filter headers to show only extra parameters
    const extraHeaders = useMemo(() => {
        return (isAdmin
            ? materialHeaders.filter((x) => x.isShowInExtraParameters)
            : materialHeaders.filter(
                (header) => header.isShowInExtraParameters
            ));
    }, [materialHeaders, isAdmin]);

    const rowData = openExtraParametersModal.rowData;

    return (
        <Dialog
            open={openExtraParametersModal.open}
            onClose={handleClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    maxHeight: "80vh",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "16px 24px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Box sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}>
                    {t("materials.childTable.extraParameters.title")}
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        color: "#666",
                        "&:hover": {
                            backgroundColor: "#e0e0e0",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: "24px", backgroundColor: "#fafafa" }}>
                {extraHeaders.length > 0 ? (
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: "60vh",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {extraHeaders.map((header, index) => {
                                        const convertedUnit =
                                            unitType === UNIT_TYPE.IMPERIAL
                                                ? convertTitleUnits(header.unit)
                                                : header.unit;

                                        return (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    textAlign: "center",
                                                    fontWeight: "bold",
                                                    whiteSpace: "nowrap",
                                                    backgroundColor: "#EBECFF",
                                                    color: "#333",
                                                    fontSize: "14px",
                                                    padding: "16px 12px",
                                                    borderBottom: "2px solid #5759A8",
                                                }}
                                            >
                                                {header.unit ? (
                                                    <div>
                                                        <span>{header.value}</span>
                                                        {convertedUnit && (
                                                            <small style={{ display: "block", fontSize: "11px" }}>
                                                                ({t(`measurementUnits.${convertedUnit}`)})
                                                            </small>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{ textTransform: "capitalize" }}>
                                                        {header.value}
                                                        <div style={{ height: "24px", width: "100%" }} />
                                                    </div>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowData && (
                                    <TableRow
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    >
                                        {extraHeaders.map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    textAlign: "center",
                                                    padding: "12px",
                                                    borderBottom: "1px solid #e0e0e0",
                                                }}
                                            >
                                                {rowData.rowData && rowData.rowData[header.key] ? (
                                                    <TableCellData
                                                        {...rowData.rowData[header.key]}
                                                        id={rowData.id}
                                                        parameterKey={header.key}
                                                        isAdmin={isAdmin}
                                                        unit={header.unit}
                                                        rowData={rowData.rowData}
                                                    />
                                                ) : (
                                                    <span style={{ color: "#999" }}>-</span>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#999",
                            fontSize: "14px",
                        }}
                    >
                        {t("materials.childTable.extraParameters.noData")}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export { ExtraParametersModal };
