import { useState } from "react";

import { quickDuplicateApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";

const useDuplicateQuickModal = ({ getQuote, onClose, documentType, quoteItemId }) => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [groups, setGroups] = useState<any>([{ id: 1, parameters: [{ name: "", value: "" }] }]);
  const addGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      parameters: [{ name: "", value: "" }]
    };
    setGroups([...groups, newGroup]);
  };

  const addParameter = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.push({ name: "", value: "" });
    setGroups(newGroups);
  };
  const deleteParameter = (groupIndex, paramIndex) => { // Step 2: Add delete function
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.splice(paramIndex, 1);
    setGroups(newGroups);
  };
  const deleteGroup = (groupIndex) => {
    const newGroups = groups.filter((_, index) => index !== groupIndex);
    // Reassign ids based on the new index
    const reorderedGroups = newGroups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));
    setGroups(reorderedGroups);
  };
  const handleDropdownChange = (groupIndex, paramIndex, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex].name = value;
    setGroups(newGroups);
  };

  const handleTextInputChange = (groupIndex, paramIndex, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex].value = value;
    setGroups(newGroups);
  };


  const onClickQuickDuplicate = async () => {
    const hasEmptyParameter = groups.some(group =>
      group.parameters.some(param => param.name === "" || param.value === "")
    );

    if (hasEmptyParameter) {
      alertFaultUpdate();
      return;
    }
    const items = groups.map(group => ({
      parameters: group.parameters.map(param => ({
        parameterId: param?.name.value, // Example ID, replace with actual logic if needed
        value: param.value
      }))
    }));
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
        getQuote()
        onClose()
      } else {
        alertFaultUpdate();
      }
    };
    await quickDuplicateApi(callApi, callBack,
      { documentType: documentType, document: { documentItemId: quoteItemId, items } });
  };
  return {
    groups,
    setGroups,
    addGroup,
    addParameter,
    deleteParameter,
    deleteGroup,
    handleDropdownChange,
    handleTextInputChange,
    onClickQuickDuplicate
  };
};

export { useDuplicateQuickModal };