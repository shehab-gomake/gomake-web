/**
 * EXAMPLE: Refactored version of extra-parameters-modal.tsx using GoMakeDialog
 * This shows how to convert your existing Dialog code to use GoMakeDialog
 * 
 * Compare this with the original file at:
 * src/widgets/materials-widget/components/extra-parameters-modal/extra-parameters-modal.tsx
 */

import { GoMakeDialog } from "@/components/dialog";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GoMakeTextInput } from "@/components/text-input";

// This is a simplified example showing the structure
export const ExtraParametersModalRefactored = ({
    openExtraParametersModal,
    handleClose,
    extraHeaders,
    rowData,
    isAdmin,
    handleInputChange,
    handleInputBlur,
    inputValues,
    renderInputField,
}: any) => {
    const { t } = useTranslation();

    return (
        <GoMakeDialog
            open={openExtraParametersModal.open}
            onClose={handleClose}
            title={t("materials.childTable.extraParameters.title")}
            maxWidth="md"
            fullWidth
            showFooter={false} // No footer needed for this modal
            customStyles={{
                paper: {
                    borderRadius: "12px",
                    maxHeight: "80vh",
                },
                header: {
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                },
                title: {
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#333",
                },
                content: {
                    padding: "8px",
                    backgroundColor: "#fafafa",
                },
            }}
        >
            {/* Body content - exactly as it was before */}
            {extraHeaders.length > 0 && rowData ? (
                <Grid container spacing={2} sx={{ overflow: "scroll", marginTop: "10px" }}>
                    {extraHeaders.map((header: any, index: number) => (
                        <Grid item key={index}>
                            {rowData.rowData && rowData.rowData[header.key] ? (
                                renderInputField(header, rowData.rowData[header.key])
                            ) : (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#333",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {header.value}
                                    </Typography>
                                    <GoMakeTextInput
                                        value=""
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleInputChange(header.key, e.target.value)
                                        }
                                        onBlur={() => handleInputBlur(header.key, inputValues[header.key])}
                                        placeholder={header.value}
                                        disabled={!isAdmin && header.isForAdmin}
                                    />
                                </Box>
                            )}
                        </Grid>
                    ))}
                </Grid>
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
        </GoMakeDialog>
    );
};

/**
 * BEFORE vs AFTER Comparison:
 * 
 * BEFORE (143 lines for Dialog structure):
 * ========================================
 * <Dialog open={open} onClose={handleClose} ...>
 *   <DialogTitle sx={{ display: "flex", justifyContent: "space-between", ... }}>
 *     <Box sx={{ fontSize: "18px", fontWeight: 600, ... }}>
 *       {t("materials.childTable.extraParameters.title")}
 *     </Box>
 *     <IconButton onClick={handleClose} ...>
 *       <CloseIcon />
 *     </IconButton>
 *   </DialogTitle>
 *   <DialogContent sx={{ padding: "8px", ... }}>
 *     {/* Content *\/}
 *   </DialogContent>
 * </Dialog>
 * 
 * AFTER (15 lines for Dialog structure):
 * ========================================
 * <GoMakeDialog
 *   open={open}
 *   onClose={handleClose}
 *   title={t("materials.childTable.extraParameters.title")}
 *   showFooter={false}
 *   customStyles={{ paper: {...}, header: {...}, content: {...} }}
 * >
 *   {/* Same content as before *\/}
 * </GoMakeDialog>
 * 
 * Benefits:
 * - 50+ lines of code reduction
 * - Consistent styling across the app
 * - Less boilerplate
 * - Easy to maintain
 * - Type-safe with TypeScript
 */

