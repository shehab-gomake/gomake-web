import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { addDocumentItemFromMaterialApi } from "@/services/api-service/materials/materials-endpoints";

const useAddNewItem = ({onClose, getQuote , documentType}) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const { alertFaultAdded ,alertSuccessAdded} = useSnackBar();
  const [combinedData, setCombinedData] = useState<any>([]);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  const getAllProductsAndMaterials = useCallback(async () => {
    const callBack = (res) => {
      if (res?.success) {
        const transformProducts = (products) => {
          return {
            key: 'products',
            label: t('tabs.products'),
            children: products.map(product => ({
              key: product.id, // Using product id as the key
              label: product.name, // Using product name as the label
              category: ProductCategoryType.PRODUCT
            }))
          };
        };
        const transformMaterials = (materials) => {
          return {
            key: 'materials',
            label: t('tabs.materials'),
            children: materials.map(material => ({
              key: material.materialTypeName, // Using materialTypeName as the key
              label: material.materialTypeName, // Using materialTypeName as the label
              children: material.categories.map(category => ({
                key: `${material.materialTypeName}-${category.categoryName}`, // Generate a unique key
                label: category.categoryName, // Using categoryName as the label
                children: category.rows.map(row => ({
                  key: row.id, // Using row id as the key
                  label: row.value, // Using row value as the label,
                  category: ProductCategoryType.MATERIAL // Ensure category is present
                }))
              }))
            }))
          };
        };


        const transformedProducts = transformProducts(res?.data?.products);
        const transformedMaterials = transformMaterials((res?.data?.materials));

        // Combine the transformed data
        const combinedFinalData = [transformedProducts, transformedMaterials];
        setCombinedData(combinedFinalData);
      }
    };
      await getAllProductAndMaterialsApi(callApi, callBack, { clientId: quoteItemValue?.client?.id,
        clientTypeId: quoteItemValue?.client?.clientTypeId,});
  }, []);


  const handleProductChange = (e) => {
    const selectedValue = e?.value;
    const findNodeByKey = (key, nodes) => {
      for (const node of nodes) {
        if (node.key === key) {
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
      setSelectedProduct({ id: selectedValue, category: selectedNode?.category , name: selectedNode?.label });
    } else {
      setSelectedProduct(null);
    }
  };

  const addDocumentItemFromMaterial = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        getQuote();
        onClose();
      } else {
        alertFaultAdded();
      }
    }
    await addDocumentItemFromMaterialApi(callApi, callBack, { clientId: quoteItemValue?.customerID, printHouseMaterialId: selectedProduct?.id , documentType , documentId: quoteItemValue?.id  });
  }

  useEffect(() => {
    getAllProductsAndMaterials();
  }, []);

  return {
    handleProductChange,
    combinedData,
    selectedProduct,
    addDocumentItemFromMaterial
  };
};

export { useAddNewItem };