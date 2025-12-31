import { useEffect, useRef, useState } from "react";

import { quickDuplicateApi, getBookParametersFromDocumentItemApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store/quote-item";
import { getProductSizesApi } from "@/services/api-service/products/product-endpoints";
import { printHouseProfile } from "@/store/print-house-profile";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { createOrderFolders } from "@/utils/order-folder-utils";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const useDuplicateQuickModal = ({
  getQuote,
  onClose,
  documentType,
  quoteItemId,
  quoteItem,
}) => {
  const { callApi } = useGomakeAxios();
  const [isRelatedJobs, setIsRelatedJobs] = useState(false);
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const [productSizes, setProductSizes] = useState([]);
  const [bookParameters, setBookParameters] = useState<any[]>([]);
  const [bookParametersValues, setBookParametersValues] = useState<Record<number, Record<string, string>>>({});
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [companyProfile] = useRecoilState(printHouseProfile);
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const [groups, setGroups] = useState<any>([
    { id: 1, parameters: [{ name: "", value: "" }] },
  ]);
  const lastGroupRef = useRef(null); // Add ref for the last group
  const prevGroupsLength = useRef(groups.length);

  const addGroup = (groupIndex) => {
    if (groups[groupIndex]) {
      const groupToDuplicate = groups[groupIndex];
      const newGroupId = groups.length + 1;
      const newGroup = {
        ...groupToDuplicate,
        id: newGroupId,
        parameters: groupToDuplicate.parameters.map((param) => ({ ...param })),
      };
      setGroups([...groups, newGroup]);

      // Initialize book parameters values for the new group - use productType as unique key
      if (bookParameters.length > 0) {
        const newBookValues: Record<string, string> = {};
        bookParameters.forEach((param) => {
          newBookValues[param.productType] = "";
        });
        setBookParametersValues((prev) => ({
          ...prev,
          [newGroupId]: newBookValues,
        }));
      }
    }
  };
  const addParameter = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.push({ name: "", value: "" });
    setGroups(newGroups);
  };
  const deleteParameter = (groupIndex, paramIndex) => {
    // Step 2: Add delete function
    const newGroups = [...groups];
    newGroups[groupIndex].parameters.splice(paramIndex, 1);
    setGroups(newGroups);
  };
  const deleteGroup = (groupIndex) => {
    const deletedGroupId = groups[groupIndex]?.id;
    const newGroups = groups.filter((_, index) => index !== groupIndex);
    // Reassign ids based on the new index
    const reorderedGroups = newGroups.map((group, index) => ({
      ...group,
      id: index + 1,
    }));
    setGroups(reorderedGroups);

    // Clean up book parameters values for deleted group and rebuild with new IDs
    if (bookParameters.length > 0 && Object.keys(bookParametersValues).length > 0) {
      const newBookParametersValues: Record<number, Record<string, string>> = {};
      // Map old groups to new groups - groups before deleted index keep same position, after shift by 1
      newGroups.forEach((group, newIndex) => {
        const oldIndex = newIndex < groupIndex ? newIndex : newIndex + 1;
        const oldGroupId = groups[oldIndex]?.id;

        if (oldGroupId && bookParametersValues[oldGroupId]) {
          newBookParametersValues[newIndex + 1] = { ...bookParametersValues[oldGroupId] };
        } else {
          // Initialize empty values for new group - use productType as unique key
          const newBookValues: Record<string, string> = {};
          bookParameters.forEach((param) => {
            newBookValues[param.productType] = "";
          });
          newBookParametersValues[newIndex + 1] = newBookValues;
        }
      });
      setBookParametersValues(newBookParametersValues);
    }
  };
  const handleDropdownChange = (groupIndex, paramIndex, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex].name = value;
    setGroups(newGroups);
  };

  const handleTextInputChange = (
    groupIndex,
    paramIndex,
    value,
    field = "value"
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex].parameters[paramIndex][field] = value;
    setGroups(newGroups);
  };

  function transformGroupList(groupList) {
    return groupList.map((group) => {
      const transformedParameters = group?.parameters.flatMap((param) => {
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
      });

      // Add book parameters if they exist - use productType as unique key
      const bookParams = bookParameters
        .filter((bookParam) => {
          const value = bookParametersValues[group.id]?.[bookParam.productType];
          return value && value !== "";
        })
        .map((bookParam) => ({
          parameterId: bookParam.parameterId,
          productType: bookParam.productType,
          actionIndex: bookParam.actionIndex,
          value: bookParametersValues[group.id][bookParam.productType],
        }));

      return {
        ...group,
        parameters: [...transformedParameters, ...bookParams],
      };
    });
  }

  const onClickQuickDuplicate = async () => {
    const transformedGroupList = transformGroupList(groups);
    const hasEmptyParameter = transformedGroupList.some((group) =>
      group.parameters.some((param) => param.name === "")
    );

    if (hasEmptyParameter) {
      alertFaultUpdate();
      return;
    }
    const items = transformedGroupList.map((group) => ({
      parameters: group.parameters
        .filter(
          (param) =>
            param.value !== null &&
            param.value !== undefined &&
            param.value !== ""
        )
        .map((param) => {
          // Book parameters already have parameterId, productType, actionIndex
          if (param.parameterId) {
            return {
              parameterId: param.parameterId,
              productType: param.productType,
              actionIndex: param.actionIndex,
              value: param.value,
            };
          }
          // Regular parameters have name.value structure
          return {
            parameterId: param?.name?.value,
            value: param?.value,
          };
        }),
    }));
    const callBack = async (res) => {
      if (res?.success) {
        // Create order folders if this is an order creation and preference is enabled
        if (
          Number(documentType) === DOCUMENT_TYPE.order &&
          res?.data?.length > 0 &&
          res?.data[0]?.documentID &&
          CheckPreferenceValue(
            EPreferences.INITIALIZE_ORDER_FOLDERS_AFTER_CREATION
          )
        ) {
          // Get the order ID from the first created item
          const orderId = res?.data[0]?.documentID;
          await createOrderFolders(callApi, orderId, companyProfile);
        }

        alertSuccessUpdate();
        setGroups([{ id: 1, parameters: [{ name: "", value: "" }] }]);
        setBookParameters([]);
        setBookParametersValues({});
        if (isRelatedJobs) {
          const selectedItemIndex = quoteItemValue?.documentItems?.findIndex(
            (item) => item?.id === quoteItemId
          );
          if (selectedItemIndex !== -1) {
            const updatedDocumentItems = [...quoteItemValue.documentItems];
            const selectedItem = { ...updatedDocumentItems[selectedItemIndex] };
            selectedItem.childsDocumentItems = [
              ...(selectedItem.childsDocumentItems || []),
              ...res?.data,
            ];
            updatedDocumentItems[selectedItemIndex] = selectedItem;
            setQuoteItemValue((prev) => ({
              ...prev,
              documentItems: updatedDocumentItems,
            }));
          }
        } else {
          setQuoteItemValue((prev) => ({
            ...prev,
            documentItems: [...prev?.documentItems, ...res?.data],
          }));
        }
        onClose();
        getQuote();
      } else {
        alertFaultUpdate();
      }
    };
    await quickDuplicateApi(callApi, callBack, {
      documentType: documentType,
      document: { documentItemId: quoteItemId, items, isRelatedJobs },
    });
  };

  const getProductSizes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setProductSizes(res?.data);
      }
    };
    await getProductSizesApi(callApi, callBack, {
      productId: quoteItem?.productID,
    });
  };

  const getBookParameters = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setBookParameters(res?.data || []);
        // Initialize values for each group - use productType as unique key
        const initialValues: Record<number, Record<string, string>> = {};
        groups.forEach((group) => {
          initialValues[group.id] = {};
          (res?.data || []).forEach((param: any) => {
            initialValues[group.id][param.productType] = "";
          });
        });
        setBookParametersValues(initialValues);
      }
    };
    await getBookParametersFromDocumentItemApi(callApi, callBack, {
      documentType: documentType,
      documentId: quoteItemId,
    });
  };

  const resetBookParameters = () => {
    setBookParameters([]);
    setBookParametersValues({});
  };

  const handleBookParameterValueChange = (
    groupId: number,
    productType: string,
    value: string
  ) => {
    setBookParametersValues((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [productType]: value,
      },
    }));
  };

  // Function to check if all available parameters are already added to a group
  const areAllParametersUsed = (groupIndex) => {
    const availableParameters = [
      "a330193f-492c-40a8-86f3-8edf5c8f0d5e", // Job Name
      "4991945c-5e07-4773-8f11-2e3483b70b53", // Quantity
      "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4", // Size
    ];

    const group = groups[groupIndex];
    if (!group) return true;

    const usedParameters = group.parameters
      .map((param) => param?.name?.value)
      .filter((value) => value && value !== "");

    return availableParameters.every((paramId) =>
      usedParameters.includes(paramId)
    );
  };

  useEffect(() => {
    // Only scroll if the number of groups has increased (duplicate/add action)
    if (lastGroupRef.current && groups.length > prevGroupsLength.current) {
      lastGroupRef.current.scrollIntoView({ behavior: "smooth" });
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
    areAllParametersUsed,
    getBookParameters,
    bookParameters,
    bookParametersValues,
    handleBookParameterValueChange,
    resetBookParameters,
  };
};

export { useDuplicateQuickModal };
