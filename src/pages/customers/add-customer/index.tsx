import {  useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { AddPlusIcon } from "@/icons";

const AddCustomerButton = ({ onCustomeradd }: any) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [customer, setCustomer] = useState([]);
  const { clasess } = useStyle();

  return (
    <>
    <CustomerCardWidget  onCustomeradd={onCustomeradd} openModal={open} modalTitle={t("customers.modal.addTitle")} onClose={()=>setOpen(false)} showAddButton={true} customer={customer} setCustomer={setCustomer} >
        </CustomerCardWidget>
     <GomakePrimaryButton
          style={clasess.addCustomerBtnStyle}
          leftIcon={<AddPlusIcon stroke="#101020" />}
          onClick={()=>setOpen(!open)}
        >
          <div style={clasess.addCustomerBtnText}>
          {t("customers.buttons.addCustomer")}
          </div>
        </GomakePrimaryButton>
         </>
  );
};
export { AddCustomerButton };

