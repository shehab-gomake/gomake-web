import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetSheetWeights } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheetModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [sheetSizes, setSheetSizes] = useState([]);
  const [categoryName, setCategoryName] = useState(item?.categoryName);
  const [supplierId, setSupplierId] = useState(item?.supplierId);

  const getSheetWeights = useCallback(async () => {
    await getAndSetSheetWeights(callApi, setSheetSizes, {
      categoryName,
      weightId: item?.weightId,
      supplierId,
    });
  }, [item]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getSheetWeights();
  }, [categoryName, supplierId]);

  return {
    onChangeCategory,
    categoryName,
  };
};

export { useSheetModal };
