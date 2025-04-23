import { useCallback, useEffect, useState } from "react";
import { getAllTemplets } from "@/services/hooks";
import { useGomakeAxios } from "./use-gomake-axios";

const useAllProductTypesDropDownList = () => {
  const { callApi } = useGomakeAxios();
  const [allProductTypes, setAllProductTypes] = useState<any>();

  const getAllProductTypes = useCallback(async () => {
    const result = await getAllTemplets(callApi);
    const mappedResult = result.map((item: any) => ({
      id: item.id,
      label: item.name,
    }));
    setAllProductTypes(mappedResult);
  }, []);

  useEffect(() => {
    getAllProductTypes();
  }, []);

  return {
    allProductTypes,
  };
};

export { useAllProductTypesDropDownList };
