import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { addClientTypeApi, deleteClientTypeApi, getAndSetClientTypes } from "@/services/api-service/customers/clientTypes-api";
import { useState } from "react";
import { useRecoilState } from "recoil";

const useClientType = (clientTypeId: CLIENT_TYPE_Id) => {
    const { callApi } = useGomakeAxios();
    const [clientTypeName, setClientTypeName] = useState();
    const [clientTypesCategories, setClientTypesCategories] = useRecoilState(clientTypesCategoriesState);

    const getClientTypesCategories = async (cardType: CLIENT_TYPE_Id) => {
        const callBack = (res) => {
            if (res.success) {
                const clientTypes = res.data.map((types) => ({
                    label: types.name,
                    id: types.id,
                }));
                setClientTypesCategories(clientTypes);
            }
        };
        await getAndSetClientTypes(callApi, callBack, { cardType: cardType });
    };

    const addClientType = async (name: string) => {
        const callBack = (res) => {
            if (res.success) {
                getClientTypesCategories(clientTypeId);

            }
        }
        await addClientTypeApi(callApi, callBack, {
            name: name,
            cardType: clientTypeId
        })
    }

    const deleteClientType = async (id: string) => {
        const callBack = (res) => {
            if (res.success) {
                getClientTypesCategories(clientTypeId);
            }
        }
        await deleteClientTypeApi(callApi, callBack, { id })
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
