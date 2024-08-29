import { useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useBudgetTab } from "./use-budget-tab";
import { PrimaryTable } from "@/components/tables/primary-table";
import { PlusIcon } from "@/icons";
import { BudgetModal } from "./budget-modal";

const BudgetTab = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { tableHeaders, mapData, addBudget, editBudget } = useBudgetTab();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBudget, setCurrentBudget] = useState(null);

    const handleAddNewBudget = () => {
        setCurrentBudget(null);
        setIsModalOpen(true);
    };

    const handleEditBudget = (budget) => {
        setCurrentBudget(budget);
        setIsModalOpen(true);
    };

    return (
        <div style={{ width: '100%', marginTop: 10 }} data-tour={'BudgetTable'}>
            <div style={classes.addNewBudgetTabStyle} onClick={handleAddNewBudget}>
                {t("New Budget")}
                <PlusIcon />
            </div>
            <PrimaryTable
                stickyFirstCol={true}
                stickyHeader={true}
                rows={mapData(handleEditBudget)}
                headers={tableHeaders}
                maxHeight={420}
            />
            {isModalOpen && (
                <BudgetModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(budget) => {
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
        </div>
    );
};

export { BudgetTab };