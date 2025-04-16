import { useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";
import { AddButton } from "@/components/button/add-button";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "../enums";

interface IProps {
  onCustomerAdd: (customer: any) => void;
  typeClient: CLIENT_TYPE;
}

const AddCustomerButton = ({ onCustomerAdd, typeClient }: IProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);

  return (
    <>
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={typeClient}
        onCustomerAdd={onCustomerAdd}
        openModal={open}
        modalTitle={
          typeClient == "C"
            ? t("customers.modal.addTitle")
            : t("suppliers.addModalTitle")
        }
        onClose={() => setOpen(false)}
        showAddButton={true}
        customer={customer}
        setCustomer={setCustomer}
      />
      <AddButton
        style={{ width: "fit-content", alignSelf: "flex-end" }}
        onClick={() => setOpen(!open)}
        label={
          typeClient == "C"
            ? t("customers.buttons.addCustomer")
            : t("suppliers.buttons.addSupplier")
        }
      />
    </>
  );
};
export { AddCustomerButton };
