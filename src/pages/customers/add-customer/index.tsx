import { useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useTranslation } from "react-i18next";
import { AddButton } from "@/components/button/add-button";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "../enums";
import { Tooltip } from "@mui/material";

interface IProps {
  onCustomerAdd: (customer: any) => void;
  typeClient: CLIENT_TYPE;
  isEmpty?: boolean;
}

const AddCustomerButton = ({
  onCustomerAdd,
  typeClient,
  isEmpty = false,
}: IProps) => {
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
        onClose={() => setOpen(false)}
        customer={customer}
        setCustomer={setCustomer}
      />
      <Tooltip title={t("customers.emptyState.clickToAdd")} arrow>
        <AddButton
          style={{ width: "fit-content", alignSelf: "flex-end" }}
          onClick={() => setOpen(!open)}
          label={
            typeClient === "C"
              ? t("customers.buttons.addCustomer")
              : t("suppliers.buttons.addSupplier")
          }
        />
      </Tooltip>
    </>
  );
};
export { AddCustomerButton };
