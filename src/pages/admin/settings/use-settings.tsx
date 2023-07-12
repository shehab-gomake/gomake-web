import { useGomakeAxios } from "@/hooks";
import { getAllProductsMongoDB } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const getActions = useCallback(async () => {
    const data = await getAllProductsMongoDB(callApi, setAllProducts);
    const mapData = data?.map((item: any) => {
      return {
        name: item?.name,
        id: item?.id,
      };
    });
    setAllProducts(mapData);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tableHeaders = [
    t("products.productManagement.admin.productCode"),
    t("products.productManagement.admin.prouctName"),
    t("products.productManagement.admin.mainProduct"),
    t("products.productManagement.admin.details"),
    t("products.productManagement.admin.groups"),
    t("products.productManagement.admin.type"),
    t("products.productManagement.admin.board"),
    t("products.productManagement.admin.status"),
    t("products.productManagement.admin.more"),
  ];
  return { tableHeaders, allProducts };
};

export { useSettings };
