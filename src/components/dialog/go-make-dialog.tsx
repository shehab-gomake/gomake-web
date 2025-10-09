import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    CircularProgress,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { GoMakeDialogProps } from "./interfaces";
import { useStyle } from "./style";

/**
 * GoMakeDialog - A reusable dialog component with header, body, and footer
 * 
 * @example Basic usage
 * ```tsx
 * <GoMakeDialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Dialog Title"
 *   onPrimaryAction={handleSave}
 * >
 *   <div>Dialog content goes here</div>
 * </GoMakeDialog>
 * ```
 * 
 * @example With custom footer
 * ```tsx
 * <GoMakeDialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Custom Footer"
 *   customFooter={
 *     <Button onClick={handleCustomAction}>Custom Action</Button>
 *   }
 * >
 *   <div>Content</div>
 * </GoMakeDialog>
 * ```
 * 
 * @example Without footer
 * ```tsx
 * <GoMakeDialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="No Footer"
 *   showFooter={false}
 * >
 *   <div>Content</div>
 * </GoMakeDialog>
 * ```
 */
const GoMakeDialog: React.FC<GoMakeDialogProps> = ({
    open,
    onClose,
    title,
    customTitle,
    showCloseButton = true,
    children,
    showFooter = true,
    primaryButtonLabel,
    cancelButtonLabel,
    onPrimaryAction,
    onCancel,
    primaryButtonDisabled = false,
    primaryButtonLoading = false,
    customFooter,
    customStyles,
    primaryButtonIcon,
    cancelButtonIcon,
    hideCancelButton = false,
    hidePrimaryButton = false,
    additionalButtons,
    maxWidth = "md",
    fullWidth = true,
    ...dialogProps
}) => {
    const { t } = useTranslation();
    const direction: "rtl" | "ltr" = t("direction");
    const isRTL = direction === "rtl";
    const { classes } = useStyle({ customStyles, isRTL });

    // Default button labels
    const primaryLabel = primaryButtonLabel || t("common.save") || "Save";
    const cancelLabel = cancelButtonLabel || t("modal.cancel") || "Cancel";

    // Handle cancel action
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (onClose) {
            onClose();
        }
    };

    // Handle primary action
    const handlePrimaryAction = () => {
        if (onPrimaryAction) {
            onPrimaryAction();
        }
    };

    return (
        <Dialog
            open={open}
            // onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            PaperProps={{
                sx: { ...classes.paper, direction },
            }}
            {...dialogProps}
        >
            {/* Header */}
            {(title || customTitle || showCloseButton) && (
                <DialogTitle sx={classes.header}>
                    {/* In RTL, close button comes first, then title */}
                    {showCloseButton && onClose && (
                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={classes.closeButton}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                    <Box sx={classes.title}>
                        {customTitle || title}
                    </Box>
                    {/* In LTR, close button comes after title */}

                </DialogTitle>
            )}

            {/* Body/Content */}
            <DialogContent sx={classes.content}>
                {children}
            </DialogContent>

            {/* Footer */}
            {showFooter && (
                <DialogActions sx={classes.footer}>
                    {/* Custom footer or default buttons */}
                    {customFooter ? (
                        customFooter
                    ) : (
                        <>
                            {/* Additional buttons - on the left in LTR, right in RTL */}
                            {!isRTL && additionalButtons && (
                                <Box sx={classes.additionalButtonsContainer}>
                                    {additionalButtons}
                                </Box>
                            )}

                            {/* Main action buttons */}
                            <Box sx={classes.footerButtonsContainer}>
                                <>
                                    <>
                                        {/* Primary Action Button (RTL - first) */}
                                        {!hidePrimaryButton && (


                                            <div
                                                onClick={handlePrimaryAction}
                                                style={classes.primaryButton}
                                            // disabled={primaryButtonDisabled || primaryButtonLoading}
                                            >
                                                <div style={classes.primaryButtonContainer}>
                                                    {primaryButtonIcon || primaryButtonLoading && <div >
                                                        {
                                                            primaryButtonLoading ? (
                                                                <CircularProgress size={16} color="inherit" />
                                                            ) : (
                                                                primaryButtonIcon
                                                            )
                                                        }
                                                    </div>}
                                                    <div>
                                                        {primaryButtonLoading ? t("common.loading") || "Loading..." : primaryLabel}
                                                    </div>
                                                </div>
                                            </div>


                                        )}

                                        {/* Cancel Button (RTL - second) */}
                                        {!hideCancelButton && (
                                            <Button
                                                onClick={handleCancel}
                                                sx={classes.cancelButton}
                                                startIcon={cancelButtonIcon}
                                            >
                                                {cancelLabel}
                                            </Button>
                                        )}
                                    </>
                                </>
                            </Box>

                            {/* Additional buttons - on the right in RTL, left in LTR */}
                            {isRTL && additionalButtons && (
                                <Box sx={classes.additionalButtonsContainer}>
                                    {additionalButtons}
                                </Box>
                            )}
                        </>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
};

export { GoMakeDialog };

