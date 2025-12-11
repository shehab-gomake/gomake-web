import React from "react";
import { Box, Typography } from "@mui/material";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useTranslation } from "react-i18next";
import { PurchaseOrderStatuses } from "@/enums";

interface PurchaseOrdersDialogsAddItemRestrictionWidgetProps {
    showAddItemRestrictionDialog: boolean;
    handleCancelAddItemRestriction: () => void;
    handleCreateNewPurchaseOrder: () => void;
    documentStatus?: number;
}

const PurchaseOrdersDialogsAddItemRestrictionWidget = ({
    showAddItemRestrictionDialog,
    handleCancelAddItemRestriction,
    handleCreateNewPurchaseOrder,
    documentStatus,
}: PurchaseOrdersDialogsAddItemRestrictionWidgetProps) => {
    const { t } = useTranslation();

    const statusText =
        documentStatus === PurchaseOrderStatuses.Received
            ? t("documentStatus.PurchaseOrder.Received")
            : t("documentStatus.PurchaseOrder.Closed");

    return (
        <GoMakeDialog
            open={showAddItemRestrictionDialog}
            onClose={handleCancelAddItemRestriction}
            title={t("sales.purchaseOrder.cannotAddItem") || "Cannot Add Item"}
            maxWidth="sm"
            showFooter={true}
            primaryButtonLabel={
                t("sales.purchaseOrder.createNewPurchaseOrder") ||
                "Create New Purchase Order"
            }
            cancelButtonLabel={t("common.cancel")}
            onPrimaryAction={handleCreateNewPurchaseOrder}
            hideCancelButton={false}
        >
            <Box sx={{ padding: "20px" }}>
                <Typography variant="body1">
                    {t("sales.purchaseOrder.addItemRestrictionMessage", {
                        status: statusText,
                    }) ||
                        `You are in ${statusText} status and cannot add new items. Would you like to create a new purchase order?`}
                </Typography>
            </Box>
        </GoMakeDialog>
    );
};

export { PurchaseOrdersDialogsAddItemRestrictionWidget };

