import { useCallback, useEffect, useState } from "react";
import { getAndSetSheetCategory } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheetPaper = () => {
  const { callApi } = useGomakeAxios();
  const [category, setCategory] = useState([]);

  const getCategory = useCallback(async () => {
    await getAndSetSheetCategory(callApi, setCategory);
  }, []);

  useEffect(() => {
    getCategory();
  }, []);

  return {
    category,
  };
};

export { useSheetPaper };
