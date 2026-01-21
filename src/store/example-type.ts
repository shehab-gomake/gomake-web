import { atom, selector } from "recoil";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState, useCallback, useRef } from "react";

const exampleTypeSelector = selector({
  key: "mySelectorExampleType",
  get: async ({ get }) => {
    try {
      const { callApi } = useGomakeAxios();
      const res = await callApi(
        "Get",
        "/v1/erp-service/product-item-value-drafts/get-proof-types"
      );
      return res?.data?.data?.data || [];
    } catch (error) {
      console.error("Error fetching example types:", error);
      return [];
    }
  },
});

export const exampleTypeState = atom({
  key: "exampleTypeState",
  default: exampleTypeSelector,
});

// Hook to manually fetch and update example types data (use this to ensure data is loaded)
export const useExampleTypes = () => {
  const { callApi } = useGomakeAxios();
  const [exampleTypeValues, setExampleTypeValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);
  const isLoadingRef = useRef(false);

  const fetchExampleTypes = useCallback(async () => {
    if (isLoadingRef.current) return; // Prevent duplicate calls
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const res = await callApi(
        "Get",
        "/v1/erp-service/product-item-value-drafts/get-proof-types",
        undefined,
        false // Don't show loading
      );
      if (res?.success && res?.data?.data?.data) {
        setExampleTypeValues(res.data.data.data);
        hasFetchedRef.current = true;
        isLoadingRef.current = false;
        setIsLoading(false);
        return res.data.data.data;
      }
      hasFetchedRef.current = true;
      isLoadingRef.current = false;
      setIsLoading(false);
      return [];
    } catch (error) {
      console.error("Error fetching example types:", error);
      hasFetchedRef.current = true;
      isLoadingRef.current = false;
      setIsLoading(false);
      return [];
    }
  }, [callApi, setExampleTypeValues]);

  useEffect(() => {
    // Always fetch on mount if we haven't fetched yet (ignore selector default)
    // This ensures we get fresh data and bypasses any issues with the selector
    if (!hasFetchedRef.current && !isLoadingRef.current) {
      fetchExampleTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount to initialize data

  // Return the values, ensuring it's always an array
  // Filter out any invalid entries (promises, null, undefined, etc.)
  const getValidValues = () => {
    try {
      if (Array.isArray(exampleTypeValues) && exampleTypeValues.length > 0) {
        // Filter to ensure all items are valid objects with expected properties
        const validItems = exampleTypeValues.filter(item => 
          item && 
          typeof item === 'object' && 
          !Array.isArray(item) &&
          ('key' in item || 'value' in item)
        );
        return validItems;
      }
    } catch (error) {
      // If exampleTypeValues is a promise or something else invalid, return empty array
      console.warn('Error accessing exampleTypeValues:', error);
    }
    return [];
  };
  
  const values = getValidValues();

  return { 
    exampleTypeValues: values, 
    refetch: fetchExampleTypes,
    isLoading 
  };
};
