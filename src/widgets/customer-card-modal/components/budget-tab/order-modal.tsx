import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { Skeleton } from "@mui/material";
import { useOrderModal } from "./use-order-modal";
import { useTranslation } from "react-i18next";

const OrdersModal = ({ isOpen, onClose, allDocuments, allDocumentsByBudget, updateDocumentBudget, selectedBudget }) => {
    const {
        handleClose,
        handleClientOrdersClick,
        mapOrdersData,
        mapClientOrdersData,
        updateDocumentsBudget,
        isClientOrdersModalOpen,
        ordersTableHeaders,
        clientOrdersTableHeaders,
    } = useOrderModal({ allDocuments, onClose, allDocumentsByBudget, updateDocumentBudget, selectedBudget })
    const { t } = useTranslation();
    return (
        <>
            {/* Orders in the current budget modal */}
            <GoMakeModal
                open={isOpen && !isClientOrdersModalOpen}
                onClose={handleClose}
                insideStyle={{ width: 800, height: "fit-content" }}
                modalTitle={t("customers.modal.theDocumentsInTheBudget")}
            >
                <div style={{ marginTop: 25 }}>
                    <GomakePrimaryButton
                        style={{ width: "fit-content", marginBottom: 25, height: 40, backgroundColor: "#EC038D" }}
                        onClick={handleClientOrdersClick}
                    >
                        {t("customers.modal.belongsToTheBudget")}
                    </GomakePrimaryButton>
                    {allDocuments.length === 0 ? (
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    ) : (
                        <PrimaryTable
                            stickyFirstCol={true}
                            stickyHeader={true}
                            rows={mapOrdersData()}
                            headers={ordersTableHeaders}
                            maxHeight={300}
                        />
                    )}
                </div>
            </GoMakeModal>

            {/* Orders of this client modal */}
            <GoMakeModal
                open={isClientOrdersModalOpen}
                onClose={handleClose}
                insideStyle={{ width: 800, height: "fit-content" }}
                modalTitle={t("customers.modal.documentsOfThisClient")}
            >
                <div style={{ marginTop: 25 }}>
                    <PrimaryTable
                        stickyFirstCol={true}
                        stickyHeader={true}
                        rows={mapClientOrdersData()}
                        headers={clientOrdersTableHeaders}
                        maxHeight={300}
                    />

                    <GomakePrimaryButton
                        style={{ width: "fit-content", marginTop: 25, height: 40, backgroundColor: "#EC038D" }}
                        onClick={() => updateDocumentsBudget()}
                    >
                        {t("customers.modal.addedToTheBudget")}
                    </GomakePrimaryButton>
                </div>
            </GoMakeModal>
        </>
    );
};

export { OrdersModal };
