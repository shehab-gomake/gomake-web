import { useTranslation } from "react-i18next";
import { selectedAgentIdsState } from "./states/selected-agent-id";
import { useRecoilState } from "recoil";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { useAgentsList } from "@/hooks/use-agent-list";
import { useCallback, useState } from "react";
import { getAllTemplets } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { selectedProductTypesIdsState } from "./states/selected-product-type-id";
import { selectedProductsIdsState } from "./states/selected-product-id";

const useSalesDashboardFilters = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { agentsCategories } = useAgentsList();
  const { productList } = useAllProductsDropDownList();
  const productItems = productList.map((product) => ({
    id: product.id,
    label: product.name,
  }));
  const [allProductTypes, setAllProductTypes] = useState<any>();

  const [selectedAgentIds, setSelectedAgentIds] = useRecoilState(
    selectedAgentIdsState
  );

  const [selectedProductIds, setSelectedProductIds] = useRecoilState(
    selectedProductsIdsState
  );
  const [selectedProductTypesIds, setSelectedProductTypesIds] = useRecoilState(
    selectedProductTypesIdsState
  );

  const toggleAgent = (id: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllAgents = () => {
    const allIds = agentsCategories.map((a) => a.id);
    const isAllSelected = allIds.every((id) => selectedAgentIds.includes(id));
    setSelectedAgentIds(isAllSelected ? [] : allIds);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    const allIds = productList.map((a) => a.id);
    const isAllSelected = allIds.every((id) => selectedProductIds.includes(id));
    setSelectedProductIds(isAllSelected ? [] : allIds);
  };

  const toggleProductType = (id: string) => {
    setSelectedProductTypesIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllProductTypes = () => {
    const allIds = allProductTypes.map((a) => a.id);
    const isAllSelected = allIds.every((id) =>
      selectedProductTypesIds.includes(id)
    );
    setSelectedProductTypesIds(isAllSelected ? [] : allIds);
  };

  //!here need to add use-product-types
  const getAllProductTypes = useCallback(async () => {
    const result = await getAllTemplets(callApi);
    const mappedResult = result.map((item: any) => ({
      id: item.id,
      label: item.name,
    }));
    setAllProductTypes(mappedResult);
  }, []);

  return {
    t,
    agentsCategories,
    productItems,
    toggleAllProducts,
    toggleProduct,
    toggleAllAgents,
    toggleAgent,
    selectedProductIds,
    selectedAgentIds,
    getAllProductTypes,
    allProductTypes,
    toggleAllProductTypes,
    toggleProductType,
    selectedProductTypesIds,
  };
};

export { useSalesDashboardFilters };
