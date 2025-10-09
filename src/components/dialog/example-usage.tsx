/**
 * Example usage of GoMakeDialog component
 * This file demonstrates various ways to use the GoMakeDialog component
 */

import React, { useState } from "react";
import { GoMakeDialog } from "./go-make-dialog";
import { Box, TextField, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

// Example 1: Basic Dialog with default footer
export const BasicDialogExample = () => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const handleSave = () => {
        console.log("Saving...");
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Basic Dialog</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title={t("materials.childTable.extraParameters.title")}
                primaryButtonLabel={t("common.save")}
                cancelButtonLabel={t("common.cancel")}
                onPrimaryAction={handleSave}
            >
                <Box sx={{ padding: 2 }}>
                    <TextField
                        fullWidth
                        label="Enter something"
                        placeholder="Type here..."
                    />
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 2: Dialog with loading state
export const LoadingDialogExample = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Loading Dialog</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Save Changes"
                primaryButtonLabel="Save"
                primaryButtonLoading={loading}
                onPrimaryAction={handleSave}
            >
                <Box sx={{ padding: 2 }}>
                    <p>Click save to see the loading state</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 3: Dialog without footer
export const NoFooterDialogExample = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Info Dialog</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Information"
                showFooter={false}
            >
                <Box sx={{ padding: 2 }}>
                    <p>This dialog has no footer buttons.</p>
                    <p>You can only close it using the X button.</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 4: Dialog with custom footer
export const CustomFooterDialogExample = () => {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log("Deleting...");
        setOpen(false);
    };

    const handleArchive = () => {
        console.log("Archiving...");
        setOpen(false);
    };

    const handleSave = () => {
        console.log("Saving...");
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Custom Footer Dialog</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Custom Actions"
                customFooter={
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={handleDelete} color="error" startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                        <Button onClick={handleArchive}>
                            Archive
                        </Button>
                        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
                            Save
                        </Button>
                    </Box>
                }
            >
                <Box sx={{ padding: 2 }}>
                    <p>This dialog has a custom footer with multiple action buttons.</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 5: Dialog with additional buttons
export const AdditionalButtonsDialogExample = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Dialog with Additional Buttons</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Document Editor"
                primaryButtonLabel="Save"
                onPrimaryAction={() => console.log("Saving...")}
                additionalButtons={
                    <>
                        <Button onClick={() => console.log("Printing...")}>
                            Print
                        </Button>
                        <Button onClick={() => console.log("Exporting...")}>
                            Export
                        </Button>
                    </>
                }
            >
                <Box sx={{ padding: 2 }}>
                    <p>This dialog has additional action buttons on the left side of the footer.</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 6: Dialog with icons on buttons
export const IconButtonsDialogExample = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Dialog with Icon Buttons</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="تجربة العنوان"
                primaryButtonLabel="حفظ"
                primaryButtonIcon={<SaveIcon />}
                onPrimaryAction={() => console.log("Saving...")}
            >
                <div>

                    dddddddddddddddddddd
                </div>
            </GoMakeDialog>
        </>
    );
};

// Example 7: Dialog with custom styles
export const CustomStyledDialogExample = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Custom Styled Dialog</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Custom Styled"
                customStyles={{
                    paper: {
                        borderRadius: "20px",
                        maxHeight: "95vh",
                    },
                    header: {
                        backgroundColor: "red",
                        padding: "20px 30px",
                    },
                    title: {
                        fontSize: "22px",
                        color: "#000",
                    },
                    content: {
                        padding: "30px",
                        backgroundColor: "#fff",
                    },
                    footer: {
                        padding: "20px 30px",
                    },
                }}
                onPrimaryAction={() => console.log("Saving...")}
            >
                <Box>
                    <p>This dialog uses custom styling for all sections.</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

// Example 8: Confirmation dialog (only primary button)
export const ConfirmationDialogExample = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Show Success</Button>

            <GoMakeDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Success"
                primaryButtonLabel="OK"
                hideCancelButton={true}
                onPrimaryAction={() => setOpen(false)}
            >
                <Box sx={{ padding: 2, textAlign: 'center' }}>
                    <p>✅ Action completed successfully!</p>
                </Box>
            </GoMakeDialog>
        </>
    );
};

