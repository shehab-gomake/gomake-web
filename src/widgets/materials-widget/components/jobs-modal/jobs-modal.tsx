import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";

// Backend job data interface
interface JobData {
    id: string;
    printHouseMaterialSupplierInventoryId: string;
    documentType: number;
    documentNumber: string;
    jobName: string;
    jobNumber: string;
    clientId: string;
    clientName: string;
    usedInventory: number;
    status: number;
}

interface JobsModalProps {
    open: boolean;
    onClose: () => void;
    supplierName?: string;
    materialCode?: string;
    materialName?: string;
    jobsData?: JobData[];
    isLoading?: boolean;
}

// Helper functions for mapping backend enum values
// DocumentTypeEnum: Quote(0), Order(1), DeliveryNote(2), Invoice(3), Receipt(4),
//                   DeliveryNoteRefund(5), InvoiceRefund(6), GeneralLedgerReport(7),
//                   PurchaseOrder(8), PurchaseInvoice(9), PurchaseInvoiceRefund(10), BoardMission(11)
const getDocumentTypeDisplay = (documentType: number, t: (key: string) => string): string => {
    switch (documentType) {
        case 0:
            return t("materials.jobsModal.documentType.quote");
        case 1:
            return t("materials.jobsModal.documentType.order");
        case 2:
            return t("materials.jobsModal.documentType.deliveryNote");
        case 3:
            return t("materials.jobsModal.documentType.invoice");
        case 4:
            return t("materials.jobsModal.documentType.receipt");
        case 5:
            return t("materials.jobsModal.documentType.deliveryNoteRefund");
        case 6:
            return t("materials.jobsModal.documentType.invoiceRefund");
        case 7:
            return t("materials.jobsModal.documentType.generalLedgerReport");
        case 8:
            return t("materials.jobsModal.documentType.purchaseOrder");
        case 9:
            return t("materials.jobsModal.documentType.purchaseInvoice");
        case 10:
            return t("materials.jobsModal.documentType.purchaseInvoiceRefund");
        case 11:
            return t("materials.jobsModal.documentType.boardMission");
        default:
            return t("materials.jobsModal.documentType.unknown");
    }
};

// InventoryUsageStatus: HoldOn = 1, Done = 2
const getStatusDisplay = (status: number, t: (key: string) => string): string => {
    switch (status) {
        case 1:
            return t("materials.jobsModal.status.holdOn");
        case 2:
            return t("materials.jobsModal.status.done");
        default:
            return t("materials.jobsModal.status.unknown");
    }
};

const getStatusColor = (status: number): string => {
    switch (status) {
        case 2: // Done
            return "#4caf50"; // Green
        case 1: // Hold On
            return "#ff9800"; // Orange
        default:
            return "#9e9e9e"; // Grey
    }
};

const JobsModal = ({
    open,
    onClose,
    supplierName,
    materialCode,
    materialName,
    jobsData,
    isLoading = false
}: JobsModalProps) => {
    const { t } = useTranslation();
    // Use the actual backend data
    const displayData = jobsData;
    const title = `${materialName} · ${supplierName} · ${materialCode} — ${t("materials.jobsModal.title")}`;

    return (
        <GoMakeDialog
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="xl"
            fullWidth={true}
            hidePrimaryButton={true}


        >
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%', marginTop: "10px" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "var(--theme-secondary-50, #EBECFF)" }}>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.clientName")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.documentType")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"  
                                }}>
                                    {t("materials.jobsModal.tableHeaders.documentNumber")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.jobName")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.jobNumber")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.usedInventory")}
                                </TableCell>
                                <TableCell sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "var(--theme-secondary-50, #EBECFF)"
                                }}>
                                    {t("materials.jobsModal.tableHeaders.status")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayData?.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ textAlign: "center", padding: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t("materials.jobsModal.emptyState")}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayData?.map((job, index) => (
                                    <TableRow key={job.id || index} hover>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            {job.clientName}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: "#f5f5f5",
                                                    borderRadius: "16px",
                                                    padding: "4px 8px",
                                                    display: "inline-block",
                                                    fontSize: "0.75rem"
                                                }}
                                            >
                                                {getDocumentTypeDisplay(job.documentType, t)}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            {job.documentNumber}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            {job.jobName}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            {job.jobNumber}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                {job.usedInventory}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                            <Box
                                                sx={{
                                                    backgroundColor: getStatusColor(job.status),
                                                    color: "white",
                                                    borderRadius: "16px",
                                                    padding: "4px 8px",
                                                    display: "inline-block",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {getStatusDisplay(job.status, t)}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </GoMakeDialog>
    );
};


export { JobsModal };
