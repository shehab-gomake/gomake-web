import { useMemo, useState } from "react";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { BudgetWidget } from "../modal";
import { AddIcon } from "@/components/icons/icons";
import { Table } from "@/widgets/table/table";

const BudgetForm = ({ item }: any) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { clasess } = useStyle();
    const tabelHeaders = useMemo(
        () => [
          t("customers.modal.budget"),
          t("customers.modal.sum"),
          t("customers.modal.balance"),
          t("customers.modal.invoiceNumber"),
          t("customers.modal.period"),
          t("customers.modal.paymentStatus"),
          t("customers.modal.status"),
          t("customers.modal.more"),
        ],
        []
      );


    return (
        <>
            <BudgetWidget openModal={open} onClose={() => setOpen(false)}  ></BudgetWidget>
            <a style={{ display: "flex", marginTop: "24px", justifyContent: 'flex-end' }} onClick={() => setOpen(!open)} >
                <AddIcon></AddIcon>
                <button style={clasess.buttonsStyle}>{t("customers.buttons.newBudget")}</button>
            </a>
            <Table styleContainer={{marginTop:"10px"}} tableHeaders={tabelHeaders} tableRows={null} ></Table>    
        </>
    );
};
export { BudgetForm };