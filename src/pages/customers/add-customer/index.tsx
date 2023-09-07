import {  useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const AddCustomerButton = ({ onCustomeradd }: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);

  return (
    <>
    <CustomerCardWidget  onCustomeradd={onCustomeradd} openModal={open} modalTitle={t("customers.modal.addTitle")} onClose={()=>setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} >
        </CustomerCardWidget>
     <GomakePrimaryButton variant="contained" onClick={()=>setOpen(!open)} style={{width: "150px",height: convertHeightToVH(50),marginRight: convertWidthToVW(10),backgroundColor: "#F135A3",letterSpacing:"0"}}>{t("customers.buttons.addCustomer")}</GomakePrimaryButton>
         </>
  );
};
export { AddCustomerButton };

