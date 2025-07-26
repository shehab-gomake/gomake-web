import { useSnackBar } from "@/hooks";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { clientGroupsCategoriesState } from "@/pages/customers/customer-states";
import {
  addClientGroupApi,
  updateClientGroupApi,
} from "@/services/api-service/customers/client-groups-api";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useClientGroup = (selectedClientGroupId) => {
  const { alertFaultAdded } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const [editedValues, setEditedValues] = useState({
    groupName: "",
    id: "",
  });
  const [clientGroupsCategories, setClientGroupsCategories] = useRecoilState(
    clientGroupsCategoriesState
  );

  const selectedItem = clientGroupsCategories?.find(
    (item) => item.id === selectedClientGroupId
  );

  useEffect(() => {
    if (selectedItem) {
      setEditedValues({
        groupName: selectedItem?.groupName,
        id: selectedItem?.id,
      });
    }
  }, [selectedItem]);

  const handleInputChange = (field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addClientGroup = async (groupName: string) => {
    const callBack = (res) => {
      if (res.success) {
        const newGroupId = res.data;
        if (newGroupId) {
          const newGroup = { groupName, id: newGroupId };
          setClientGroupsCategories((prev) => [...prev, newGroup]);
        }
      } else {
        alertFaultAdded();
      }
    };
    await addClientGroupApi(callApi, callBack, { groupName });
  };

  const updateClientGroup = async () => {
    const callBack = (res) => {
      if (res.success) {
        const updatedGroup = editedValues;
        setClientGroupsCategories((prev) =>
          prev.map((group) =>
            group.id === updatedGroup.id
              ? { ...group, groupName: editedValues.groupName }
              : group
          )
        );
      }
    };
    await updateClientGroupApi(callApi, callBack, editedValues);
  };

  return {
    editedValues,
    handleInputChange,
    addClientGroup,
    selectedItem,
    updateClientGroup,
  };
};

export { useClientGroup };
