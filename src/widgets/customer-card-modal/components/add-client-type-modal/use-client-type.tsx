import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { addClientTypeApi, deleteClientTypeApi, getAndSetClientTypes, updateClientTypeApi } from "@/services/api-service/customers/clientTypes-api";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useClientType = (clientTypeId: CLIENT_TYPE_Id) => {
    const { callApi } = useGomakeAxios();
    const [clientTypeName, setClientTypeName] = useState();
    const [clientTypesCategories, setClientTypesCategories] = useRecoilState<any>(clientTypesCategoriesState);
    const [editedValues, setEditedValues] = useState({});
    const [originalValues, setOriginalValues] = useState({});

    useEffect(() => {
        if (clientTypesCategories) {
            const initialValues = clientTypesCategories.reduce((acc, item) => {
                acc[item.id] = {
                    clientTypeName: item.label,
                    additionProfits: item.additionProfits,
                };
                return acc;
            }, {});
            setOriginalValues(initialValues);
            setEditedValues(initialValues);
        }
    }, [clientTypesCategories]);


    const getClientTypesCategories = async (cardType: CLIENT_TYPE_Id) => {
        const callBack = (res) => {
            if (res.success) {
                const clientTypes = res.data.map((types) => ({
                    label: types.name,
                    id: types.id,
                    additionProfits: types?.additionProfits ?? 0,
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
            else {
                setEditedValues(originalValues);

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
            else {
                setEditedValues(originalValues);

            }
        }
        await deleteClientTypeApi(callApi, callBack, { id })
    }

    const updateClientType = async (updatedClientType: any) => {
        const { label, ...updatedClientTypeWithoutLabel } = updatedClientType;
        const callBack = (res) => {
            if (res.success) {
                getClientTypesCategories(clientTypeId);
            }
            else {
                setEditedValues(originalValues);

            }
        }
        await updateClientTypeApi(callApi, callBack, updatedClientTypeWithoutLabel);
    }


    const handleInputChange = (id, field, value) => {
        setEditedValues({
            ...editedValues,
            [id]: {
                ...editedValues[id],
                [field]: value,
            },
        });
    };

    return {
        clientTypeName,
        setClientTypeName,
        addClientType,
        deleteClientType,
        clientTypesCategories,
        updateClientType,
        editedValues,
        setEditedValues,
        handleInputChange
    };
};

export { useClientType };
