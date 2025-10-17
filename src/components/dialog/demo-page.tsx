/**
 * GoMakeDialog Demo Page
 * 
 * This page demonstrates all features of the GoMakeDialog component
 * You can temporarily add this to your routes to see the component in action
 * 
 * To use: Add this to your pages directory or import in an existing page
 */

import React, { useState } from "react";
import { GoMakeDialog } from "./go-make-dialog";
import {
    Box,
    Button,
    TextField,
    Typography,
    Stack,
    Paper,
    Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { useTranslation } from "react-i18next";

const GoMakeDialogDemo = () => {
    const { t } = useTranslation();
    const [openBasic, setOpenBasic] = useState(false);
    const [openLoading, setOpenLoading] = useState(false);
    const [openNoFooter, setOpenNoFooter] = useState(false);
    const [openCustomFooter, setOpenCustomFooter] = useState(false);
    const [openAdditional, setOpenAdditional] = useState(false);
    const [openIcons, setOpenIcons] = useState(false);
    const [openCustomStyle, setOpenCustomStyle] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLoadingAction = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setOpenLoading(false);
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto" }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
                🎨 GoMakeDialog Component Demo
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, textAlign: "center", color: "#666" }}>
                Click any button below to see different dialog configurations
            </Typography>

            <Grid container spacing={3}>
                {/* Basic Dialog */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            1. Basic Dialog
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Standard dialog with header, body, and footer buttons
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenBasic(true)}
                        >
                            Open Basic Dialog
                        </Button>
                    </Paper>
                </Grid>

                {/* Loading Dialog */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            2. Loading State
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Dialog with loading state on primary button
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenLoading(true)}
                        >
                            Open Loading Dialog
                        </Button>
                    </Paper>
                </Grid>

                {/* No Footer */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            3. No Footer
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            View-only dialog without footer buttons
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenNoFooter(true)}
                        >
                            Open No Footer
                        </Button>
                    </Paper>
                </Grid>

                {/* Custom Footer */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            4. Custom Footer
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Dialog with completely custom footer
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenCustomFooter(true)}
                        >
                            Open Custom Footer
                        </Button>
                    </Paper>
                </Grid>

                {/* Additional Buttons */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            5. Additional Buttons
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Dialog with extra action buttons on the left
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenAdditional(true)}
                        >
                            Open Additional Buttons
                        </Button>
                    </Paper>
                </Grid>

                {/* Icon Buttons */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            6. Button Icons
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Buttons with icons for better UX
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenIcons(true)}
                        >
                            Open Icon Buttons
                        </Button>
                    </Paper>
                </Grid>

                {/* Custom Style */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            7. Custom Styling
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Dialog with custom colors and spacing
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenCustomStyle(true)}
                        >
                            Open Custom Style
                        </Button>
                    </Paper>
                </Grid>

                {/* Confirmation */}
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 3, height: "100%" }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            8. Confirmation
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                            Success message with single OK button
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setOpenConfirmation(true)}
                        >
                            Open Confirmation
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog Implementations */}

            {/* 1. Basic Dialog */}
            <GoMakeDialog
                open={openBasic}
                onClose={() => setOpenBasic(false)}
                title="Basic Dialog Example"
                primaryButtonLabel="Save"
                cancelButtonLabel="Cancel"
                onPrimaryAction={() => {
                    console.log("Save clicked");
                    setOpenBasic(false);
                }}
            >
                <Stack spacing={2}>
                    <TextField fullWidth label="Name" placeholder="Enter your name" />
                    <TextField fullWidth label="Email" placeholder="Enter your email" />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Message"
                        placeholder="Enter your message"
                    />
                </Stack>
            </GoMakeDialog>

            {/* 2. Loading Dialog */}
            <GoMakeDialog
                open={openLoading}
                onClose={() => setOpenLoading(false)}
                title="Save Changes"
                primaryButtonLabel="Save"
                primaryButtonLoading={loading}
                onPrimaryAction={handleLoadingAction}
            >
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        Click the Save button to see the loading state
                    </Typography>
                    <TextField fullWidth label="Data to save" defaultValue="Some data" />
                </Box>
            </GoMakeDialog>

            {/* 3. No Footer */}
            <GoMakeDialog
                open={openNoFooter}
                onClose={() => setOpenNoFooter(false)}
                title="Information"
                showFooter={false}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        📋 System Information
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                        • No footer buttons in this dialog
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                        • Can only close using X button or clicking outside
                    </Typography>
                    <Typography>• Perfect for view-only content</Typography>
                </Box>
            </GoMakeDialog>

            {/* 4. Custom Footer */}
            <GoMakeDialog
                open={openCustomFooter}
                onClose={() => setOpenCustomFooter(false)}
                title="Custom Footer Actions"
                customFooter={
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            width: "100%",
                            justifyContent: "flex-end",
                            p: 2,
                        }}
                    >
                        <Button
                            onClick={() => {
                                console.log("Delete");
                                setOpenCustomFooter(false);
                            }}
                            color="error"
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("Archive");
                                setOpenCustomFooter(false);
                            }}
                        >
                            Archive
                        </Button>
                        <Button
                            onClick={() => {
                                console.log("Save");
                                setOpenCustomFooter(false);
                            }}
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                    </Box>
                }
            >
                <Box sx={{ p: 2 }}>
                    <Typography>
                        This dialog has a completely custom footer with three action buttons
                    </Typography>
                </Box>
            </GoMakeDialog>

            {/* 5. Additional Buttons */}
            <GoMakeDialog
                open={openAdditional}
                onClose={() => setOpenAdditional(false)}
                title="Document Editor"
                primaryButtonLabel="Save"
                onPrimaryAction={() => {
                    console.log("Save");
                    setOpenAdditional(false);
                }}
                additionalButtons={
                    <>
                        <Button onClick={() => console.log("Print")} startIcon={<PrintIcon />}>
                            Print
                        </Button>
                        <Button onClick={() => console.log("Share")} startIcon={<ShareIcon />}>
                            Share
                        </Button>
                    </>
                }
            >
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        Notice the Print and Share buttons on the left side of the footer
                    </Typography>
                    <TextField fullWidth multiline rows={5} defaultValue="Document content here..." />
                </Box>
            </GoMakeDialog>

            {/* 6. Icon Buttons */}
            <GoMakeDialog
                open={openIcons}
                onClose={() => setOpenIcons(false)}
                title="Save Document"
                primaryButtonLabel="Save"
                primaryButtonIcon={<SaveIcon />}
                onPrimaryAction={() => {
                    console.log("Save with icon");
                    setOpenIcons(false);
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        The Save button has an icon for better visual feedback
                    </Typography>
                    <TextField fullWidth label="Document Name" defaultValue="My Document" />
                </Box>
            </GoMakeDialog>

            {/* 7. Custom Style */}
            <GoMakeDialog
                open={openCustomStyle}
                onClose={() => setOpenCustomStyle(false)}
                title="Custom Styled Dialog"
                customStyles={{
                    paper: {
                        borderRadius: "20px",
                        border: "2px solid #9c27b0",
                    },
                    header: {
                        backgroundColor: "#f3e5f5",
                        padding: "20px 30px",
                    },
                    title: {
                        fontSize: "24px",
                        color: "#9c27b0",
                        fontWeight: 700,
                    },
                    content: {
                        padding: "30px",
                        backgroundColor: "#fce4ec",
                    },
                    footer: {
                        padding: "20px 30px",
                        backgroundColor: "#f3e5f5",
                    },
                }}
                onPrimaryAction={() => setOpenCustomStyle(false)}
            >
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: "#9c27b0" }}>
                        🎨 Custom Styling Applied!
                    </Typography>
                    <Typography>
                        • Purple color scheme
                        <br />
                        • Increased padding
                        <br />
                        • Custom border radius
                        <br />
                        • Different background colors
                    </Typography>
                </Box>
            </GoMakeDialog>

            {/* 8. Confirmation */}
            <GoMakeDialog
                open={openConfirmation}
                onClose={() => setOpenConfirmation(false)}
                title="Success!"
                primaryButtonLabel="OK"
                hideCancelButton={true}
                onPrimaryAction={() => setOpenConfirmation(false)}
            >
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        ✅
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Operation Completed Successfully
                    </Typography>
                    <Typography color="text.secondary">
                        Your changes have been saved
                    </Typography>
                </Box>
            </GoMakeDialog>
        </Box>
    );
};

export default GoMakeDialogDemo;

/**
 * To use this demo page:
 * 
 * Option 1: Add to your routing (Next.js pages router)
 * Create: pages/demo/dialog.tsx
 * Content: export { default } from "@/components/dialog/demo-page";
 * Visit: http://localhost:3004/demo/dialog
 * 
 * Option 2: Import in existing page
 * import GoMakeDialogDemo from "@/components/dialog/demo-page";
 * <GoMakeDialogDemo />
 */

