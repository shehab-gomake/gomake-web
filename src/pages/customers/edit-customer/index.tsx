import { getAndSetCustomer } from "@/services/hooks/get-set-customers";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";

const ShowCustomerCard = ({ item , clientType }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [customer, setCustomer] = useState(null);
  const [open, setOpen] = useState(false);

  const getCustomers = useCallback(async () => {
    const data = await getAndSetCustomer(callApi, setCustomer, {
      customerId: item.id ,
    });
    return data;
  }, [item]);

  useEffect(() => {
    getCustomers();
  }, [item]);
  
  return (
    <>
      <IconButton>
        <EditIcon onClick={()=>setOpen(!open)} />
      </IconButton>
      {customer && <CustomerCardWidget openModal={open} modalTitle={clientType === "S" ? t("suppliers.editModalTitle") : t("customers.modal.editTitle")} onClose={() => setOpen(false)} customer={customer} setCustomer={setCustomer} showUpdateButton={true}></CustomerCardWidget>}
    </>
  );
};
export { ShowCustomerCard };

