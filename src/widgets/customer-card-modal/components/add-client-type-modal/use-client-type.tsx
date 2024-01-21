import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { addClientTypeApi } from "@/services/api-service/customers/clientTypes-api";
import { useState } from "react";

const useClientType = (clientTypeId : CLIENT_TYPE_Id) => {
    const { callApi } = useGomakeAxios();
    const [clientTypeName , setClientTypeName] = useState();



    const addClientType = async ( name : string) => {
        const callBack = (res) => {
            if (res.success) {

                console.log("the result is " , res)
              //  setProfile(res.data);
            }
        }
        await addClientTypeApi(callApi, callBack , {
            name: name,
            cardType : clientTypeId
          } )
    }




  return {
    clientTypeName,
    setClientTypeName,
    addClientType
};
};

export { useClientType };
