import { useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useBudgetTab } from "./use-budget-tab";
import { PrimaryTable } from "@/components/tables/primary-table";
import { PlusIcon } from "@/icons";
import { BudgetModal } from "./budget-modal";
import { OrdersModal } from "./order-modal";
import { Skeleton } from "@mui/material";

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
        tableHeaders,
        budgets,
        allDocumentsByBudgetId,
        isModalOpen,
        isOrdersModalOpen,
        currentBudget,
        allDocumentsByBudget

    } = useBudgetTab(state);



    return (
        <div style={{ width: '100%', marginTop: 10 }} data-tour={'BudgetTable'}>
            <div style={classes.addNewBudgetTabStyle} onClick={handleAddNewBudget}>
                {t("New Budget")}
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
                />
            )}
        </div>
    );
};

export { BudgetTab };