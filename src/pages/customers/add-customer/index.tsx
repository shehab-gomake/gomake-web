import {  useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const AddCustomerButton = ({ item }: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState(null);



  return (
    <>
    <CustomerCardWidget openModal={open} modalTitle={t("customers.modal.addTitle")} onClose={()=>setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} >
        </CustomerCardWidget>
     <GomakePrimaryButton variant="contained" onClick={()=>setOpen(!open)} style={{width: convertWidthToVW(100),height: convertHeightToVH(50),marginRight: convertWidthToVW(10),backgroundColor: "#F135A3",}}>{t("customers.buttons.addCustomer")}</GomakePrimaryButton>
         </>
  );
};
export { AddCustomerButton };

