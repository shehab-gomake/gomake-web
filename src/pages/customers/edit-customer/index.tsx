import { getAndSetCustomer } from "@/services/hooks/get-set-customers";
import { IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
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
      {customer && <CustomerCardWidget openModal={open} modalTitle="Edit Customer" onClose={() => setOpen(false)} customer={customer} showUpdateButton={true}></CustomerCardWidget>}
    </>
  );
};
export { ShowCustomerCard };

