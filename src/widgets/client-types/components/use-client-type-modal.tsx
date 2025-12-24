import { useClientTypesList } from "@/hooks/use-client-types";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import {
  addClientTypeApi,
  updateClientTypeApi,
} from "@/services/api-service/customers/clientTypes-api";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const useClientType = (cardTypeId, selectedClientTypeId) => {
  const { callApi } = useGomakeAxios();
  const clientTypesCategories = useRecoilValue<any>(clientTypesCategoriesState);
  const [editedValues, setEditedValues] = useState({
    clientTypeName: "",
    additionProfits: "0",
    discount: "0",
    excludeOutsourceJobs: false,
  });
  const { getClientTypesCategories } = useClientTypesList();

  const selectedItem = clientTypesCategories?.find(
    (item) => item.id === selectedClientTypeId
  );

  useEffect(() => {
    if (selectedItem) {
      setEditedValues({
        clientTypeName: selectedItem.label,
        additionProfits: selectedItem.additionProfits,
        discount: selectedItem.discount,
        excludeOutsourceJobs: selectedItem.excludeOutsourceJobs ?? false,
      });
    }
  }, [selectedItem]);

  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addClientType = async (
    name: string,
    additionProfits?: string,
    discount?: string,
    excludeOutsourceJobs?: boolean
  ) => {
    const callBack = (res) => {
      if (res.success) {
        getClientTypesCategories(cardTypeId);
      }
    };
    await addClientTypeApi(callApi, callBack, {
      name,
      cardType: cardTypeId,
      additionProfits,
      discount,
      excludeOutsourceJobs,
    });
  };

  const updateClientType = async () => {
    const updatedClientType = {
      ...selectedItem,
      clientTypeName: editedValues.clientTypeName,
      additionProfits: editedValues.additionProfits,
      discount: editedValues.discount,
      excludeOutsourceJobs: editedValues.excludeOutsourceJobs,
    };
    const { label, ...updatedClientTypeWithoutLabel } = updatedClientType;

    const callBack = (res) => {
      if (res.success) {
        getClientTypesCategories(cardTypeId);
      }
    };
    await updateClientTypeApi(callApi, callBack, updatedClientTypeWithoutLabel);
  };

  return {
    editedValues,
    handleInputChange,
    addClientType,
    updateClientType,
    selectedItem,
  };
};

export { useClientType };
