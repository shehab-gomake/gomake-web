import React from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakePrimaryButton } from "@/components";
import { Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
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
  loading = false,
}) => {
  const { t } = useTranslation();
  const { primaryColor, grayColor } = useGomakeTheme();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.changeSupplier")}
      showFooter={true}
      hideCancelButton={true}
      hidePrimaryButton={true}
      customFooter={
        <Stack direction="row-reverse" spacing={2} sx={{ width: "100%" }}>


          <GomakePrimaryButton
            onClick={onStartNew}
            disabled={loading}
            style={{
              width: "fit-content",
              height: "40px",
              fontSize: "16px",
              fontWeight: 500,
              backgroundColor: loading ? "#ccc" : primaryColor(500),
            }}
          >
            {t("sales.purchaseOrder.startNewPurchaseOrder")}
          </GomakePrimaryButton>
          <GomakePrimaryButton
            onClick={onRecalculatePrice}
            disabled={loading}
            style={{
              width: "fit-content",
              height: "40px",
              fontSize: "16px",
              fontWeight: 500,
              backgroundColor: loading ? "#ccc" : "#FFF",
              color: loading ? "#ccc" : primaryColor(500),
              border: `1px solid ${loading ? "#ccc" : primaryColor(500)}`,
            }}
          >
            {t("sales.purchaseOrder.changeSupplierAndRecalculatePrice")}
          </GomakePrimaryButton>



          <GomakePrimaryButton
            onClick={onKeepItemsWithoutPriceChange}
            disabled={loading}
            style={{
              width: "fit-content",
              height: "40px",
              fontSize: "16px",
              fontWeight: 500,
              backgroundColor: loading ? "#ccc" : "#FFF",
              color: loading ? "#ccc" : primaryColor(500),
              border: `1px solid ${loading ? "#ccc" : primaryColor(500)}`,
            }}
          >
            {t("sales.purchaseOrder.changeSupplierAndKeepItemsWithoutPriceChange")}
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

