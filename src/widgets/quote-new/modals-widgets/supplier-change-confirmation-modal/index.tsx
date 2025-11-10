import React from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakePrimaryButton } from "@/components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
  const { primaryColor } = useGomakeTheme();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.changeSupplier")}
      // showFooter={false}
      hideCancelButton
      hidePrimaryButton
      maxWidth="sm"
    >
      <Stack spacing={2} sx={{ padding: "0px 0", paddingTop: "8px" }}>
        <GomakePrimaryButton
          onClick={onStartNew}
          disabled={loading}
          style={{
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
            height: "40px",
            fontSize: "16px",
            fontWeight: 500,
            backgroundColor: loading ? "#ccc" : primaryColor(500),
          }}
        >
          {t("sales.purchaseOrder.changeSupplierAndRecalculatePrice")}
        </GomakePrimaryButton>

        <GomakePrimaryButton
          onClick={onKeepItemsWithoutPriceChange}
          disabled={loading}
          style={{
            height: "40px",
            fontSize: "16px",
            fontWeight: 500,
            backgroundColor: loading ? "#ccc" : primaryColor(500),
          }}
        >
          {t("sales.purchaseOrder.changeSupplierAndKeepItemsWithoutPriceChange")}
        </GomakePrimaryButton>

      </Stack>
    </GoMakeDialog>
  );
};

export { SupplierChangeConfirmationModal };

