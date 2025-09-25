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
} from "@mui/material";
import { TabCloseIcon } from "@/icons";
interface JobsModalProps {
    open: boolean;
    onClose: () => void;
    supplierName?: string;
    materialCode?: string;
    materialName?: string;
}

// Mock data for Jobs modal
const mockJobsData = [
    {
        clientName: "Client 1",
        documentType: "Quote",
        documentNumber: "Q123456",
        jobName: "Job name 1",
        status: "Hold On"
    },
    {
        clientName: "Client 2",
        documentType: "Order",
        documentNumber: "D123758 / J125",
        jobName: "Job name 2",
        status: "Done"
    },
    {
        clientName: "Client 3",
        documentType: "Invoice",
        documentNumber: "I987654",
        jobName: "Job name 3",
        status: "In Progress"
    },
    {
        clientName: "Client 4",
        documentType: "Quote",
        documentNumber: "Q456789",
        jobName: "Job name 4",
        status: "Pending"
    },
    {
        clientName: "Client 5",
        documentType: "Order",
        documentNumber: "O789012",
        jobName: "Job name 5",
        status: "Completed"
    }
];

const JobsModal = ({
    open,
    onClose,
    supplierName = "Fares",
    materialCode = "1234",
    materialName = "m1"
}: JobsModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
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
                                    STATUS
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockJobsData.map((job, index) => (
                                <TableRow key={index} hover>
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
                                            {job.documentType}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        {job.documentNumber}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        {job.jobName}
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
                                            {job.status}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

// Helper function to get status color
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "done":
        case "completed":
            return "#4caf50"; // Green
        case "in progress":
            return "#ff9800"; // Orange
        case "hold on":
        case "pending":
            return "#f44336"; // Red
        default:
            return "#9e9e9e"; // Grey
    }
};

export { JobsModal };
