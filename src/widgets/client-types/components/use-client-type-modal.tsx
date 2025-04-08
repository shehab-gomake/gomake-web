import { useClientTypesList } from "@/hooks/use-client-types";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import {
  addClientTypeApi,
  deleteClientTypeApi,
  updateClientTypeApi,
} from "@/services/api-service/customers/clientTypes-api";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

//!here
const useClientType = (clientTypeId: CLIENT_TYPE_Id) => {
  const { callApi } = useGomakeAxios();
  const [clientTypeName, setClientTypeName] = useState();
  const clientTypesCategories = useRecoilValue<any>(clientTypesCategoriesState);
  const [editedValues, setEditedValues] = useState({});
  const [originalValues, setOriginalValues] = useState({});
  const { getClientTypesCategories } = useClientTypesList();

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

  const addClientType = async (name: string) => {
    const callBack = (res) => {
      if (res.success) {
        getClientTypesCategories(clientTypeId);
      } else {
        setEditedValues(originalValues);
      }
    };
    await addClientTypeApi(callApi, callBack, {
      name: name,
      cardType: clientTypeId,
    });
  };

  const deleteClientType = async (id: string) => {
    const callBack = (res) => {
      if (res.success) {
        getClientTypesCategories(clientTypeId);
      } else {
        setEditedValues(originalValues);
      }
    };
    await deleteClientTypeApi(callApi, callBack, { id });
  };

  const updateClientType = async (updatedClientType: any) => {
    const { label, ...updatedClientTypeWithoutLabel } = updatedClientType;
    const callBack = (res) => {
      if (res.success) {
        getClientTypesCategories(clientTypeId);
      } else {
        setEditedValues(originalValues);
      }
    };
    await updateClientTypeApi(callApi, callBack, updatedClientTypeWithoutLabel);
  };

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
    handleInputChange,
  };
};

export { useClientType };
