import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { addNewRoleApi } from "@/services/api-service/users/permissions";

const useAddRole = () => {
  const [openAddRoleModal, setOpenAddRoleModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const { alertSuccessAdded, alertFaultAdded,alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const addNewRole = async () => {
    if(inputValue){
      const callBack = (res) => {
        if (res.success) {
          alertSuccessAdded();
          setOpenAddRoleModal(false);
          setInputValue("");
        } else {
          alertFaultAdded();
        }
      };
      await addNewRoleApi(callApi, callBack, { name: inputValue });
    }
    else{
      alertFault("products.offsetPrice.admin.errorReq");
    }
   
  };
  return {
    openAddRoleModal,
    setOpenAddRoleModal,
    addNewRole,
    inputValue,
    setInputValue,
  };
};

export { useAddRole };
