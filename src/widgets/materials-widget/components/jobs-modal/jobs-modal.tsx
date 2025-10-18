import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { TabCloseIcon } from "@/icons";

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
const getDocumentTypeDisplay = (documentType: number): string => {
    switch (documentType) {
        case 0:
            return "Quote";
        case 1:
            return "Order";
        case 2:
            return "Invoice";
        default:
            return "Unknown";
    }
};

const getStatusDisplay = (status: number): string => {
    switch (status) {
        case 0:
            return "Pending";
        case 1:
            return "In Progress";
        case 2:
            return "Completed";
        case 3:
            return "On Hold";
        case 4:
            return "Cancelled";
        default:
            return "Unknown";
    }
};

const getStatusColor = (status: number): string => {
    switch (status) {
        case 2: // Completed
            return "#4caf50"; // Green
        case 1: // In Progress
            return "#ff9800"; // Orange
        case 3: // On Hold
        case 0: // Pending
            return "#f44336"; // Red
        case 4: // Cancelled
            return "#9e9e9e"; // Grey
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
    // Use the actual backend data
    const displayData = jobsData;
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "8px",
                    minHeight: "400px"
                }
            }}
        >
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #e0e0e0"
            }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {materialName} · {supplierName} · {materialCode} — Jobs
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <TabCloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: 0 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, width: '100%' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#EBECFF" }}>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        CLIENT NAME
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        DOCUMENT TYPE
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        DOCUMENT NUMBER
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        JOB NAME
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        JOB NUMBER
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        USED INVENTORY
                                    </TableCell>
                                    <TableCell sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                        backgroundColor: "#EBECFF"
                                    }}>
                                        STATUS
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayData?.length === 0 && !isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ textAlign: "center", padding: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No jobs found for this material
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
                                                    {getDocumentTypeDisplay(job.documentType)}
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
                                                    {getStatusDisplay(job.status)}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: "#9c27b0",
                        "&:hover": {
                            backgroundColor: "#7b1fa2",
                        }
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export { JobsModal };
