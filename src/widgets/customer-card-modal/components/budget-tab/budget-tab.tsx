import { useTranslation } from "react-i18next";

import { PrimaryTable } from "@/components/tables/primary-table";
import { Skeleton } from "@mui/material";
import { PlusIcon } from "@/icons";

import { BudgetModal } from "./budget-modal";
import { OrdersModal } from "./order-modal";
import { useBudgetTab } from "./use-budget-tab";
import { useStyle } from "./style";
import { GoMakeDeleteModal } from "@/components";

const BudgetTab = ({ state }) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {
        mapData,
        addBudget,
        editBudget,
        setBudgets,
        handleViewOrders,
        handleEditBudget,
        handleAddNewBudget,
        setIsModalOpen,
        setIsOrdersModalOpen,
        updateDocumentBudget,
        onCloseCreateInvoiceModal,
        navigate,
        tableHeaders,
        budgets,
        allDocumentsByBudgetId,
        isModalOpen,
        isOrdersModalOpen,
        currentBudget,
        allDocumentsByBudget,
        selectedBudget,
        openCreateInvoiceModal,
        path
    } = useBudgetTab(state);
    return (
        <div style={{ width: '100%', marginTop: 10 }} data-tour={'BudgetTable'}>
            <div style={classes.addNewBudgetTabStyle} onClick={handleAddNewBudget}>
                {t("customers.buttons.newBudget")}
                <PlusIcon />
            </div>
            {budgets.length === 0 ? (
                <Skeleton variant="rectangular" width={"100%"} height={250} />
            ) : (
                <PrimaryTable
                    stickyFirstCol={true}
                    stickyHeader={true}
                    rows={mapData(handleEditBudget, handleViewOrders)}
                    headers={tableHeaders}
                    maxHeight={420}
                />
            )}
            {isModalOpen && (
                <BudgetModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(budget) => {
                        setBudgets([])
                        if (currentBudget) {
                            editBudget(budget);
                        } else {
                            addBudget(budget);
                        }
                        setIsModalOpen(false);
                    }}
                    budget={currentBudget}
                />
            )}
            {isOrdersModalOpen && (
                <OrdersModal
                    isOpen={isOrdersModalOpen}
                    onClose={() => setIsOrdersModalOpen(false)}
                    allDocuments={allDocumentsByBudgetId}
                    allDocumentsByBudget={allDocumentsByBudget}
                    updateDocumentBudget={updateDocumentBudget}
                    selectedBudget={selectedBudget}
                />
            )}

            <GoMakeDeleteModal
                hideIcon={true}
                title={t("do you want to create a invoice ?")}
                yesBtn={t("create invoice")}
                cancelBtn={t("modal.cancel")}
                openModal={openCreateInvoiceModal}
                onClose={onCloseCreateInvoiceModal}
                onClickDelete={() => navigate(path)}
            />
        </div>
    );
};

export { BudgetTab };