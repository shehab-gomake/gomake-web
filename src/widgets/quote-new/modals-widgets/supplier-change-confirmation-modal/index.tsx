import React from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakePrimaryButton } from "@/components";
import { Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

interface SupplierChangeConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onStartNew: () => void;
  onRecalculatePrice: () => void;
  onKeepItemsWithoutPriceChange: () => void;
  loading?: boolean;
}

const SupplierChangeConfirmationModal: React.FC<SupplierChangeConfirmationModalProps> = ({
  open,
  onClose,
  onStartNew,
  onRecalculatePrice,
  onKeepItemsWithoutPriceChange,
}) => {
  const { t } = useTranslation();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.changeSupplier")}
      showFooter={true}
      hideCancelButton={true}
      hidePrimaryButton={true}
      customFooter={
        <Stack direction="row" sx={{ width: "100%", gap: "20px" }}>
          <GomakePrimaryButton
            onClick={onStartNew}
            style={{
              width: "33%",
              minWidth: "fit-content",
              textAlign: "center",
              height: "44px",
              borderRadius: "15px",
              ...FONT_FAMILY.Lexend(600, 14),
              backgroundColor: "rgb(255, 255, 255)",
              color: "rgb(39, 41, 119)",
              border: "1px solid rgb(115, 117, 205)",
            }}
          >
            {t("sales.purchaseOrder.startNewPurchaseOrder")}
          </GomakePrimaryButton>

          <GomakePrimaryButton
            onClick={onKeepItemsWithoutPriceChange}
            style={{
              width: "33%",
              minWidth: "fit-content",
              height: "44px",
              borderRadius: "15px",
              ...FONT_FAMILY.Lexend(600, 14),
              backgroundColor: "var(--theme-primary-color, #2E3092)",
              border: "1px solid var(--theme-primary-color, #2E3092)",
              color: "rgb(255, 255, 255)",
            }}
          >
            {t("sales.purchaseOrder.changeSupplierAndKeepItemsWithoutPriceChange")}
          </GomakePrimaryButton>

          <GomakePrimaryButton
            onClick={onRecalculatePrice}
            style={{
              height: "44px",
              width: "33%",
              borderRadius: "15px",
              ...FONT_FAMILY.Lexend(600, 14),
              backgroundColor: "var(--theme-primary-color, #2E3092)",
              border: "1px solid var(--theme-primary-color, #2E3092)",
              color: "rgb(255, 255, 255)",
            }}
          >
            {t("sales.purchaseOrder.changeSupplierAndRecalculatePrice")}
          </GomakePrimaryButton>

        </Stack>
      }
      maxWidth="lg"
    >
      <Stack spacing={2} sx={{ padding: "20px 0" }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              ...FONT_FAMILY.Outfit(500, 16),
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {t("sales.purchaseOrder.changeSupplierDescription")}

          </Typography>
        </Box>
      </Stack>
    </GoMakeDialog>
  );
};

export { SupplierChangeConfirmationModal };

