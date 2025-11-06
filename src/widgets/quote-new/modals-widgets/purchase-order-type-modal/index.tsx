import React from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakePrimaryButton } from "@/components";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface PurchaseOrderTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: () => void;
  onSelectMaterial: () => void;
}

const PurchaseOrderTypeModal: React.FC<PurchaseOrderTypeModalProps> = ({
  open,
  onClose,
  onSelectProduct,
  onSelectMaterial,
}) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.selectPurchaseOrderType")}
      showFooter={false}
      maxWidth="xs"
    >
      <Stack spacing={2} sx={{ padding: "20px 0" }}>
        <GomakePrimaryButton
          onClick={onSelectProduct}
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: 500,
            backgroundColor: primaryColor(500),
          }}
        >
          {t("sales.purchaseOrder.purchaseOrderForProduct")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          onClick={onSelectMaterial}
          style={{
            height: "48px",
            fontSize: "16px",
            fontWeight: 500,
            backgroundColor: primaryColor(500),
          }}
        >
          {t("sales.purchaseOrder.purchaseOrderForMaterial")}
        </GomakePrimaryButton>
      </Stack>
    </GoMakeDialog>
  );
};

export { PurchaseOrderTypeModal };

