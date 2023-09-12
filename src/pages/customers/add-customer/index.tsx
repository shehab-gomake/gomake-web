import { useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { AddPlusIcon } from "@/icons";
import { AddButton } from "@/components/button/add-button";

const AddCustomerButton = ({ onCustomeradd }: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);
  const { clasess } = useStyle();

  return (
    <>
      <CustomerCardWidget onCustomeradd={onCustomeradd} openModal={open} modalTitle={t("customers.modal.addTitle")} onClose={() => setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} >
      </CustomerCardWidget>
      <AddButton onClick={() => setOpen(!open)} label={t("customers.buttons.addCustomer")}></AddButton>
    </>
  );
};
export { AddCustomerButton };

