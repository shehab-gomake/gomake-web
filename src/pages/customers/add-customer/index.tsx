import { useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";
import { AddButton } from "@/components/button/add-button";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "../enums";

interface IProps {
  isValidCustomer?: ( value: any , value1:any , value2:any , value3:any) => boolean;
  onCustomerAdd: (customer: any) => void;
  typeClient: CLIENT_TYPE;
} 

const AddCustomerButton = ({ isValidCustomer ,onCustomerAdd , typeClient}: IProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);

  return (
    <>
      <CustomerCardWidget isValidCustomer={isValidCustomer}  customerAction={CUSTOMER_ACTIONS.Add} codeFlag={false} typeClient={typeClient} onCustomerAdd={onCustomerAdd} openModal={open} modalTitle={typeClient=="C" ? t("customers.modal.addTitle") : t("suppliers.addModalTitle") } onClose={() => setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} /> 
      <AddButton onClick={() => setOpen(!open)} label={typeClient=="C" ? t("customers.buttons.addCustomer") : t("suppliers.buttons.addSupplier")}></AddButton>
    </>
  );
};
export { AddCustomerButton };