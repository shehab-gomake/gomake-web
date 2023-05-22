import { getAndSetCustomer } from "@/services/hooks/get-set-customers";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useState } from "react";
import { ButtonsWidget } from "@/widgets/add-customer-modal";
import { useGomakeAxios } from "@/hooks";

const ShowCustomerCard = ({ item }: any) => {
  const { callApi } = useGomakeAxios();

  const [customer, setCustomer] = useState(null);
  const [open, setOpen] = useState(false);

  const getCustomers = useCallback(async () => {
    const data = await getAndSetCustomer(callApi, setCustomer, {
      customerId: item.id ,
    });
    return data;
  }, []);

  useEffect(() => {
    getCustomers();
  }, []);
  
  return (
    <>
      <IconButton>
        <EditIcon onClick={()=>setOpen(!open)} />
      </IconButton>
      {customer && <ButtonsWidget openModal={open} onClose={() => setOpen(false)} customer={customer} showUpdateButton={true}></ButtonsWidget>}
    </>
  );
};
export { ShowCustomerCard };

