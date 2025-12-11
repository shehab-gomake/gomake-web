import React from "react";
import { Box, Typography } from "@mui/material";
// import { useTranslation } from "react-i18next";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useTranslation } from "react-i18next";


const PurchaseOrdersDialogsIntakeValidationWidget = ({ showIntakeValidationDialog, handleCancelIntakeValidation, handleOpenIntakeFromValidation }:
  { showIntakeValidationDialog: boolean, handleCancelIntakeValidation: () => void, handleOpenIntakeFromValidation: () => void }) => {
  const { t } = useTranslation();

  {/* Undo Intake Dialog - when changing from Received status */ }

  return (
    <GoMakeDialog
      open={showIntakeValidationDialog}
      onClose={handleCancelIntakeValidation}
      title={t("sales.purchaseOrder.intakeValidation") || "Intake Required"}
      maxWidth="sm"
      showFooter={true}
      primaryButtonLabel={t("sales.purchaseOrder.intake")}
      cancelButtonLabel={t("common.cancel")}
      onPrimaryAction={handleOpenIntakeFromValidation}
      hideCancelButton={false}
    >
      <Box sx={{ padding: "20px" }}>
        <Typography variant="body1">
          {t("sales.purchaseOrder.someItemsNotIntake") || "Some items not Intake"}
        </Typography>
      </Box>
    </GoMakeDialog>
  );
};

export { PurchaseOrdersDialogsIntakeValidationWidget };
