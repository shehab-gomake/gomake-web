import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { addClientTypeApi, deleteClientTypeApi } from "@/services/api-service/customers/clientTypes-api";
import { useState } from "react";
import { useRecoilValue } from "recoil";

const useClientType = (clientTypeId : CLIENT_TYPE_Id) => {
    const { callApi } = useGomakeAxios();
    const [clientTypeName , setClientTypeName] = useState();
    const clientTypesCategories = useRecoilValue(clientTypesCategoriesState);



    const addClientType = async ( name : string) => {
        const callBack = (res) => {
            if (res.success) {

                console.log("the result is " , res)
                // getallClientsTypes

            }
        }
        await addClientTypeApi(callApi, callBack , {
            name: name,
            cardType : clientTypeId
          } )
    }



    
    const deleteClientType = async ( id:string) => {
        const callBack = (res) => {
            if (res.success) {

                console.log("the result is " , res)
                // getallClientsTypes

            }
        }
        await deleteClientTypeApi(callApi, callBack , {id} )
    }


  return {
    clientTypeName,
    setClientTypeName,
    addClientType,
    deleteClientType,
    clientTypesCategories
};
};

export { useClientType };
