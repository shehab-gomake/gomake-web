import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "../use-gomake-axios";
import { useSetRecoilState } from "recoil";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { subProductsParametersState } from "@/store";
import { useTranslation } from "react-i18next";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { useRouter } from "next/router";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";

const useSelectedProduct = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isEditProductMode, setIsEditProductMode] = useState(false);

  const onCnClickEditProductMode = () => {
    setIsEditProductMode(true);
  };
  const onCnClickSaveProductMode = () => {
    setIsEditProductMode(false);
  };
  const onCnClickChangeProductMode = () => {
    setIsEditProductMode(!isEditProductMode);
  };

  const { callApi } = useGomakeAxios();

  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [combinedData, setCombinedData] = useState<any>([]);
  const setSubProducts = useSetRecoilState<any>(subProductsParametersState);
  const [selectedTab, setSelectedTab] = useState<ETab>(ETab.PRODUCTS);

  const getAllProductsAndMaterials = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        const transformProducts = (products) => {
          return {
            value: ETab.PRODUCTS,
            selectable: false,
            title: t("tabs.products"),
            text: t("tabs.products"),
            level: 0,
            children: products.map((product) => ({
              value: product.id, // Using product id as the key
              title: product.name, // Using product name as the label,
              text: product.name,
              code: product.code,
              level: 1,
              category: ProductCategoryType.PRODUCT,
            })),
          };
        };
        const transformMaterials = (materials) => {
          return {
            value: ETab.MATERIALS,
            title: t("tabs.materials"),
            text: t("tabs.materials"),
            level: 0,
            selectable: false,
            children: materials.map((material) => ({
              value: material.materialTypeName,
              title: material.materialTypeName,
              text: material.materialTypeName,
              level: 1, // Material Types are level 1
              selectable: false,
              category: ProductCategoryType.MATERIAL,
              children: material.categories.map((category) => ({
                value: `${material.materialTypeName}-${category.categoryName}`,
                title: category.categoryName,
                text: category.categoryName,
                selectable: false,
                level: 2, // Categories are level 2
                category: ProductCategoryType.MATERIAL,
                children: category.rows.map((row) => ({
                  value: row.id,
                  title: row.value,
                  text: row.value,
                  level: 3, // Rows are level 3
                  category: ProductCategoryType.MATERIAL,
                })),
              })),
            })),
          };
        };

        const transformedProducts = transformProducts(res?.data?.products);
        const transformedMaterials = transformMaterials(res?.data?.materials);

        // Combine the transformed data
        const combinedFinalData = [transformedProducts, transformedMaterials];
        setCombinedData(combinedFinalData);
      }
    };

    const clientId = router?.query?.customerId;
    const clientTypeId = router?.query?.clientTypeId;

    const params: any = {
      selectionType: selectedTab,
    };

    if (clientId && clientTypeId) {
      params.clientId = clientId;
      params.clientTypeId = clientTypeId;
    }

    await getAllProductAndMaterialsApi(callApi, callBack, params);
  }, [selectedTab, router?.query]);

  useEffect(() => {
    getAllProductsAndMaterials();
  }, []);
  const handleProductChange = (e, shouldReload = false) => {
    const selectedValue = e;
    // Find the selected node from combinedData
    const findNodeByKey = (key, nodes) => {
      for (const node of nodes) {
        if (node.value === key) {
          return node;
        }
        if (node.children) {
          const found = findNodeByKey(key, node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const selectedNode = findNodeByKey(selectedValue, combinedData);

    if (selectedNode && !selectedNode.children) {
      if (shouldReload) {
        // Reload page when changed from dropdown
        const newQuery = { ...router.query, productId: selectedValue };
        const queryString = new URLSearchParams(newQuery as any).toString();
        const newUrl = `${window.location.origin}${router.asPath.split('?')[0]}${queryString ? `?${queryString}` : ''}`;
        window.location.href = newUrl;
      } else {
        // Just update URL and state without reload (from useEffect)
        router.push({
          pathname: router.pathname,
          query: { ...router.query, productId: selectedValue },
        });
        setSelectedProduct({
          id: selectedValue,
          category: selectedNode?.category,
        });
      }
    } else {
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (combinedData?.length > 0) {
      const products = combinedData?.find(
        (item) => item.value === ETab.PRODUCTS
      )?.children;
      const findDefaultProduct = products.find(
        (item) => item.value === router?.query?.productId
      );
      if (findDefaultProduct && selectedProduct?.id !== findDefaultProduct?.value) {
        handleProductChange(findDefaultProduct?.value, false);
      }
    }
  }, [combinedData, router?.query?.productId]);

  return {
    isEditProductMode,
    selectedProduct,
    combinedData,
    setSubProducts,
    handleProductChange,
    onCnClickSaveProductMode,
    onCnClickChangeProductMode,
    onCnClickEditProductMode
  };
};

export { useSelectedProduct };
