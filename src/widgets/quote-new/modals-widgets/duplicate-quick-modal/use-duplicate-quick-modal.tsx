import { useEffect, useRef, useState } from "react";

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
  const lastGroupRef = useRef(null); // Add ref for the last group
  const prevGroupsLength = useRef(groups.length);


  const addGroup = (groupIndex) => {
    if (groups[groupIndex]) {
      const groupToDuplicate = groups[groupIndex];
      const newGroup = {
        ...groupToDuplicate,
        id: groups.length + 1,
        parameters: groupToDuplicate.parameters.map(param => ({ ...param }))
      };
      setGroups([...groups, newGroup]);
    }
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
              value: param?.value?.id, // Extract the ID
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
      parameters: group.parameters
        .filter(param => param.value !== null && param.value !== undefined && param.value !== "")
        .map(param => ({
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

  // Function to check if all available parameters are already added to a group
  const areAllParametersUsed = (groupIndex) => {
    const availableParameters = [
      "a330193f-492c-40a8-86f3-8edf5c8f0d5e", // Job Name
      "4991945c-5e07-4773-8f11-2e3483b70b53", // Quantity
      "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4"  // Size
    ];

    const group = groups[groupIndex];
    if (!group) return true;

    const usedParameters = group.parameters
      .map(param => param?.name?.value)
      .filter(value => value && value !== "");

    return availableParameters.every(paramId => usedParameters.includes(paramId));
  };

  useEffect(() => {
    // Only scroll if the number of groups has increased (duplicate/add action)
    if (lastGroupRef.current && groups.length > prevGroupsLength.current) {
      lastGroupRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    prevGroupsLength.current = groups.length;
  }, [groups.length]);

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
    productSizes,
    lastGroupRef,
    areAllParametersUsed
  };
};

export { useDuplicateQuickModal };