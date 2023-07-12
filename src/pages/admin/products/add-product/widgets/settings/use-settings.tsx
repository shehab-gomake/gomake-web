import { useGomakeAxios } from "@/hooks";
import {
  getAllGroups,
  getAllTemplets,
  getAlltProductSKU,
} from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allProductSKU, setAllProductSKU] = useState<any>();
  const [allTemplate, setAllTemplate] = useState<any>();
  const [allGroups, setAllGroups] = useState<any>();
  const getAllProductsSKU = useCallback(async () => {
    const data = await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);

  const getAllTemplate = useCallback(async () => {
    const data = await getAllTemplets(callApi, setAllTemplate);
  }, []);

  const getAllGroupsF = useCallback(async () => {
    const data = await getAllGroups(callApi, setAllGroups);
    setAllTemplate(data);
  }, []);

  useEffect(() => {
    getAllProductsSKU();
    getAllTemplate();
    getAllGroupsF();
  }, []);

  return {
    t,
    allProductSKU,
    allTemplate,
    allGroups,
  };
};

export { useSettings };
