import { useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";
import { AddButton } from "@/components/button/add-button";
import {useRecoilState} from "recoil";
import { customerState } from "../customer-states";

const AddCustomerButton = ({ onCustomeradd , typeClient}: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useRecoilState(customerState);

  return (
    <>
      <CustomerCardWidget codeFlag={false} typeClient={typeClient} onCustomeradd={onCustomeradd} openModal={open} modalTitle={typeClient=="C" ? t("customers.modal.addTitle") : t("suppliers.addModalTitle") } onClose={() => setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} >
      </CustomerCardWidget>
      <AddButton onClick={() => setOpen(!open)} label={typeClient=="C" ? t("customers.buttons.addCustomer") : t("suppliers.buttons.addSupplier")}></AddButton>
    </>
  );
};
export { AddCustomerButton };