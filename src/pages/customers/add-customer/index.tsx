import {  useState } from "react";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { GomakePrimaryButton } from "@/components";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const AddCustomerButton = ({ item }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
    <CustomerCardWidget openModal={open} modalTitle="Add Customer" onClose={()=>setOpen(false)} showAddButton={true} >
        </CustomerCardWidget>
     <GomakePrimaryButton variant="contained" onClick={()=>setOpen(!open)} style={{width: convertWidthToVW(100),height: convertHeightToVH(50),marginRight: convertWidthToVW(10),backgroundColor: "#F135A3",}}>
          Add Customer
        </GomakePrimaryButton>
         </>
  );
};
export { AddCustomerButton };

