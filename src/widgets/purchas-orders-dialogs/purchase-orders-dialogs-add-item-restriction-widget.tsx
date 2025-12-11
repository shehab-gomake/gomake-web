import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useTranslation } from "react-i18next";
import { PurchaseOrderStatuses } from "@/enums";
import { GomakePrimaryButton } from "@/components";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface PurchaseOrdersDialogsAddItemRestrictionWidgetProps {
    showAddItemRestrictionDialog: boolean;
    handleCancelAddItemRestriction: () => void;
    handleCreateNewPurchaseOrder: () => void;
    handleChangeStatusToUnderCreation?: () => void;
    documentStatus?: number;
}

const PurchaseOrdersDialogsAddItemRestrictionWidget = ({
    showAddItemRestrictionDialog,
    handleCancelAddItemRestriction,
    handleCreateNewPurchaseOrder,
    handleChangeStatusToUnderCreation,
    documentStatus,
}: PurchaseOrdersDialogsAddItemRestrictionWidgetProps) => {
    const { t } = useTranslation();
    const { primaryColor, neutralColor } = useGomakeTheme();
    const statusText =
        documentStatus === PurchaseOrderStatuses.Received
            ? t("documentStatus.PurchaseOrder.Received")
            : t("documentStatus.PurchaseOrder.Closed");

    const underCreationStatusText = t("documentStatus.PurchaseOrder.UnderCreation") || "Under Creation";

    const handleChangeStatus = () => {
        if (handleChangeStatusToUnderCreation) {
            handleChangeStatusToUnderCreation();
        }
    };

    const direction: "rtl" | "ltr" = t("direction");

    return (
        <GoMakeDialog
            open={showAddItemRestrictionDialog}
            onClose={handleCancelAddItemRestriction}
            title={t("sales.purchaseOrder.cannotAddItem") || "Cannot Add Item"}
            maxWidth="md"
            showFooter={true}
            cancelButtonLabel={t("common.cancel")}
            customFooter={
                <Stack
                    direction="row"
                    gap={"10px"}
                    sx={{
                        width: "100%",
                        justifyContent: direction !== "rtl" ? "flex-start" : "flex-end",
                        flexDirection: direction !== "rtl" ? "row-reverse" : "row"
                    }}
                >


                    <GomakePrimaryButton
                        onClick={handleCreateNewPurchaseOrder}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "100px",
                            width: "fit-content",
                            height: "40px",
                            borderRadius: "8px",
                            ...FONT_FAMILY.Lexend(500, 14),
                            backgroundColor: primaryColor(500),
                            color: "#FFFFFF",
                            textTransform: "none" as const,
                            "&:hover": {
                                backgroundColor: primaryColor(600),
                            },
                            "&:disabled": {
                                backgroundColor: neutralColor(300),
                                color: neutralColor(500),
                            },
                        }}
                    >
                        {t("sales.purchaseOrder.createNewPurchaseOrder") || "Create New Purchase Order"}
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={handleChangeStatus}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "100px",
                            width: "fit-content",
                            height: "40px",
                            borderRadius: "8px",
                            ...FONT_FAMILY.Lexend(500, 14),
                            backgroundColor: primaryColor(500),
                            color: "#FFFFFF",
                            textTransform: "none" as const,
                            "&:hover": {
                                backgroundColor: primaryColor(600),
                            },
                            "&:disabled": {
                                backgroundColor: neutralColor(300),
                                color: neutralColor(500),
                            },
                        }}
                    >
                        {t("sales.quote.changeStatus") || `Change Status to ${underCreationStatusText}`}
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={handleCancelAddItemRestriction}
                        style={{
                            minWidth: "100px",
                            width: "fit-content",
                            height: "40px",
                            borderRadius: "8px",
                            ...FONT_FAMILY.Lexend(500, 14),
                            backgroundColor: "transparent",
                            color: neutralColor(700),
                            border: `1px solid ${neutralColor(300)}`,
                            textTransform: "none" as const,
                            "&:hover": {
                                backgroundColor: neutralColor(100),
                                borderColor: neutralColor(400),
                            },
                        }}
                    >
                        {t("common.cancel")}
                    </GomakePrimaryButton>
                </Stack>
            }
        >
            <Box sx={{ paddingTop: "10px", textAlign: "center" }}>
                <Typography variant="body1" sx={{ marginBottom: "12px" }}>
                    {t("sales.purchaseOrder.addItemRestrictionMessage", {
                        status: statusText,
                    }) ||
                        `You cannot add items while the purchase order is in ${statusText} status.`}
                </Typography>
                <Typography>
                    {t("sales.purchaseOrder.addItemRestrictionOptions", {
                        underCreationStatusText: underCreationStatusText,
                    })}
                </Typography>
            </Box>
        </GoMakeDialog>
    );
};

export { PurchaseOrdersDialogsAddItemRestrictionWidget };

