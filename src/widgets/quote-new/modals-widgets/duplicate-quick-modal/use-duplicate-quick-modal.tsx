import { useEffect, useState } from "react";

import { quickDuplicateApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store/quote-item";
import { getProductSizesApi } from "@/services/api-service/products/product-endpoints";

const useDuplicateQuickModal = ({ getQuote, onClose, documentType, quoteItemId, quoteItem }) => {
  const { callApi } = useGomakeAxios();
  const [isRelatedJobs, setIsRelatedJobs] = useState(false);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [productSizes, setProductSizes] = useState([]);
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

  const handleTextInputChange = (groupIndex, paramIndex, value, field = "value") => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex][field] = value;
    setGroups(newGroups);
  };

  function transformGroupList(groupList) {
    return groupList.map(group => ({
      ...group,
      parameters: group?.parameters.flatMap(param => {
        if (typeof param.value === "object" || (param.length && param.width)) {
          const result = [];
          if (typeof param.value === "object") {
            result.push({
              name: param.name,
              value: param.value.id, // Extract the ID
            });
          }
          if (param.length && param.width) {
            result.push(
              {
                name: {
                  label: "length",
                  value: "d2c965d3-6b08-4380-9d4b-17c361d7e484", // Replace with actual unique identifier if needed
                },
                value: param.length, // Extract the length
              },
              {
                name: {
                  label: "width",
                  value: "4ba9a275-4fbc-4313-b284-e9b1cf8b452e", // Replace with actual unique identifier if needed
                },
                value: param.width, // Extract the width
              }
            );
          }
          return result;
        } else {
          // Leave unchanged if value is not an object
          return param;
        }
      }),
    }));
  }

  const onClickQuickDuplicate = async () => {
    const transformedGroupList = transformGroupList(groups);
    const hasEmptyParameter = transformedGroupList.some(group =>
      group.parameters.some(param => param.name === "")
    );

    if (hasEmptyParameter) {
      alertFaultUpdate();
      return;
    }
    const items = transformedGroupList.map(group => ({
      parameters: group.parameters.map(param => ({
        parameterId: param?.name.value, // Example ID, replace with actual logic if needed
        value: param.value
      }))
    }));
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }])
        if (isRelatedJobs) {
          const selectedItemIndex = quoteItemValue?.documentItems?.findIndex(item => item?.id === quoteItemId);
          if (selectedItemIndex !== -1) {
            const updatedDocumentItems = [...quoteItemValue.documentItems];
            const selectedItem = { ...updatedDocumentItems[selectedItemIndex] };
            selectedItem.childsDocumentItems = [...(selectedItem.childsDocumentItems || []), ...res?.data];
            updatedDocumentItems[selectedItemIndex] = selectedItem;
            setQuoteItemValue((prev) => ({ ...prev, documentItems: updatedDocumentItems }));
          }
        } else {
          setQuoteItemValue((prev) => ({ ...prev, documentItems: [...prev?.documentItems, ...res?.data] }))

        }
        onClose()
        getQuote()
      } else {
        alertFaultUpdate();
      }
    };
    await quickDuplicateApi(callApi, callBack,
      { documentType: documentType, document: { documentItemId: quoteItemId, items, isRelatedJobs } });
  };

  const getProductSizes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setProductSizes(res?.data)
      }
    };
    await getProductSizesApi(callApi, callBack, { productId: quoteItem?.productID });
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
    onClickQuickDuplicate,
    isRelatedJobs,
    setIsRelatedJobs,
    getProductSizes,
    productSizes
  };
};

export { useDuplicateQuickModal };