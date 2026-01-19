import React from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakePrimaryButton } from "@/components";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { WarningIcon } from "@/icons";

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
  const { primaryColor, grayColor } = useGomakeTheme();

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.purchaseOrder.selectPurchaseOrderType")}
      showFooter={true}
      hideCancelButton={true}
      hidePrimaryButton={true}
      customFooter={
        <Stack direction="row" sx={{ width: "100%", gap: "20px" }}>
          <GomakePrimaryButton
            onClick={onSelectProduct}
            style={{
              width: "50%",
              height: "44px",
              minWidth: "fit-content",
              borderRadius: "15px",
              ...FONT_FAMILY.Lexend(600, 14),
              backgroundColor: "var(--theme-primary-color, #2E3092)",
              border: "1px solid var(--theme-primary-color, #2E3092)",
              color: "rgb(255, 255, 255)",
            }}
          >
            {t("sales.purchaseOrder.purchaseOrderForProduct")}
          </GomakePrimaryButton>
          <GomakePrimaryButton
            onClick={onSelectMaterial}
            style={{
              width: "50%",
              height: "44px",
              minWidth: "fit-content",
              borderRadius: "15px",
              ...FONT_FAMILY.Lexend(600, 14),
              backgroundColor: "var(--theme-primary-color, #2E3092)",
              border: "1px solid var(--theme-primary-color, #2E3092)",
              color: "rgb(255, 255, 255)",
            }}
          >
            {t("sales.purchaseOrder.purchaseOrderForMaterial")}
          </GomakePrimaryButton>
        </Stack>
      }
      maxWidth="sm"
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
            {t("sales.purchaseOrder.selectPurchaseOrderTypeDescription")}
          </Typography>
        </Box>
      </Stack>
    </GoMakeDialog>
  );
};

export { PurchaseOrderTypeModal };

