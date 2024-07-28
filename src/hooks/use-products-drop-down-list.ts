import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

import { getAllProductsForDropDownList } from "@/services/hooks";
import { productsForDropDownList } from "@/store";

import { useGomakeAxios } from "./use-gomake-axios";

const useAllProductsDropDownList = () => {
  const { callApi } = useGomakeAxios();
  const [productList,setProductList]=useRecoilState(productsForDropDownList)

  const getAllProducts = useCallback(async () => {
    await getAllProductsForDropDownList(callApi, setProductList);
  }, []);

  useEffect(() => {
    getAllProducts();
  }, []);

  return {
    productList
  };
};

export { useAllProductsDropDownList };
