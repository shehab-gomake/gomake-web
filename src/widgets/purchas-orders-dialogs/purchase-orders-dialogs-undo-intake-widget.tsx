import React from "react";
import { Box, Typography } from "@mui/material";
// import { useTranslation } from "react-i18next";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useTranslation } from "react-i18next";


const PurchaseOrdersDialogsUndoIntakeWidget = ({ showUndoIntakeDialog, handleCancelUndoIntake, handleConfirmUndoIntake }:
  { showUndoIntakeDialog: boolean, handleCancelUndoIntake: () => void, handleConfirmUndoIntake: () => void }) => {
  const { t } = useTranslation();

  {/* Undo Intake Dialog - when changing from Received status */ }

  return (
    <GoMakeDialog
      open={showUndoIntakeDialog}
      onClose={handleCancelUndoIntake}
      title={t("sales.purchaseOrder.undoIntakeConfirmation") || "Undo Intake?"}
      maxWidth="sm"
      showFooter={true}
      primaryButtonLabel={t("common.yes")}
      cancelButtonLabel={t("common.no")}
      onPrimaryAction={handleConfirmUndoIntake}
      hideCancelButton={false}
    >
      <Box sx={{ paddingTop: "10px", textAlign: "center" }}>
        <Typography variant="body1">
          {t("sales.purchaseOrder.undoIntakeMessage") || "Do you want to undo the intake before changing the status?"}
        </Typography>
      </Box>
    </GoMakeDialog>
  );
};

export { PurchaseOrdersDialogsUndoIntakeWidget };
