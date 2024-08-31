import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";
import { addDocumentItemFromMaterialApi, getDocumentItemDataFromMaterialApi } from "@/services/api-service/materials/materials-endpoints";
import { v4 as uuidv4 } from "uuid";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import { addItemApi } from "@/services/api-service/generic-doc/documents-api";

const useAddNewItem = ({ onClose, getQuote, documentType }) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const router = useRouter();
  
  const [combinedData, setCombinedData] = useState<any>([]);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);

  const getAllProductsAndMaterials = useCallback(async (clientId, clientTypeId) => {
    const callBack = (res) => {
      if (res?.success) {
        const transformProducts = (products) => {
          return {
            value: 'products',
            selectable:false,
            title: t('tabs.products'),
            text: t('tabs.products'),
            level: 0,
            children: products.map(product => ({
              value: product.id, // Using product id as the key
              title: product.name, // Using product name as the label,
              text: product.name,
              code: product.code,
              level: 1,
              category: ProductCategoryType.PRODUCT
            }))
          };
        };
        const transformMaterials = (materials) => {
          return {
            value: 'materials',
            title: t('tabs.materials'),
            text: t('tabs.materials'),
            level: 0,
            selectable:false,
            children: materials.map(material => ({
              value: material.materialTypeName,
              title: material.materialTypeName,
              text: material.materialTypeName,
              level: 1, // Material Types are level 1
              selectable:false,
              children: material.categories.map(category => ({
                value: `${material.materialTypeName}-${category.categoryName}`,
                title: category.categoryName,
                text: category.categoryName,
                selectable:false,
                level: 2, // Categories are level 2
                children: category.rows.map(row => ({
                  value: row.id,
                  title: row.value,
                  text: row.value,
                  level: 3, // Rows are level 3
                  category: ProductCategoryType.MATERIAL
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
    await getAllProductAndMaterialsApi(callApi, callBack, {
      clientId: clientId,
      clientTypeId: clientTypeId
    });
  }, []);


  const handleProductChange = (e) => {
    const selectedValue = e;
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
    debugger
    if (selectedNode && !selectedNode.children) {
      setSelectedProduct({ id: selectedValue, category: selectedNode?.category, name: selectedNode?.text, code: selectedNode?.code });
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
    await addDocumentItemFromMaterialApi(callApi, callBack, { clientId: quoteItemValue?.customerID, printHouseMaterialId: selectedProduct?.id, documentType, documentId: quoteItemValue?.id });
  }

  const [isDisabled, setIsDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const _renderErrorMessage = () => {
    if (!selectedProduct?.id) {
      return t("home.admin.pleaseSelectProduct");
    }
  };


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const checkVariables = (var1) => {
    if (var1?.id) {
      return false;
    } else {
      return true;
    }
  };

  const getDocumentItemDataFromMaterial = async () => {
    const callBack = (res) => {
      if (res.success) {
        const selectedMaterial = res?.data;
        const materialItem = {
          id: uuidv4(),
          code: selectedMaterial?.productCode,
          details: selectedMaterial?.details,
          price: selectedMaterial?.unitPrice,
          workName: "",
          discount: 0,
          finalPrice: 0,
          quantity: 0,
          productName: selectedMaterial?.productName,
          isSelected: false,
          productType: 0,
          productID: selectedMaterial?.productId,
        }

        const updatedQuoteItemValue = { ...quoteItemValue };
        const newItem = { ...materialItem };
        updatedQuoteItemValue.documentItems = [
          ...updatedQuoteItemValue.documentItems,
          newItem
        ];
        setQuoteItemValue(updatedQuoteItemValue);
        onClose();
      } else {
        alertFaultAdded();
      }
    }
    await getDocumentItemDataFromMaterialApi(callApi, callBack, { printHouseMaterialId: selectedProduct?.id });
  }


  useEffect(() => {
    if (quoteItemValue?.client?.id) {
      getAllProductsAndMaterials(quoteItemValue?.client?.id, quoteItemValue?.client?.clientTypeId);
    }
  }, [quoteItemValue?.client?.id]);


  useEffect(() => {
    const isDisabled = checkVariables(
      selectedProduct
    );
    setIsDisabled(isDisabled);

  }, [selectedProduct]);


  const item = {
    id: uuidv4(),
    code: selectedProduct?.code,
    details: "",
    price: 0,
    workName: "",
    discount: 0,
    finalPrice: 0,
    quantity: 0,
    productName: selectedProduct?.name,
    isSelected: false,
    productType: 0,
    productID: selectedProduct?.id,
  }

  const addItemForQuotes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
        onClose();
      } else {
        alertFaultAdded();
      }
    };

    await addItemApi(callApi, callBack, {
      item: {
        itemId: router?.query?.Id,
        productId: selectedProduct?.id,
        unitPrice: 0,
        amount: 0,
        jobDetails: "",
      },
      documentType: documentType,
    });
  };

  const onClickCreateQuoteForCustomer = () => {
    if (router.query.isNewCreation) {
      if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
        getDocumentItemDataFromMaterial()
      }
      else {
        const updatedQuoteItemValue = { ...quoteItemValue };
        const newItem = { ...item, id: uuidv4() };
        updatedQuoteItemValue.documentItems = [
          ...updatedQuoteItemValue.documentItems,
          newItem
        ];
        setQuoteItemValue(updatedQuoteItemValue);
        onClose();
      }
    }
    else {
      if (documentType === DOCUMENT_TYPE.purchaseOrder) {
        if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
          addDocumentItemFromMaterial()
        }
        else
          addItemForQuotes()
      }
      else {
        if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
          addDocumentItemFromMaterial()
        }
        else navigate(
          `/products/create?clientTypeId=${quoteItemValue?.client?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${selectedProduct?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
        );
      }
    }
  };
  
  return {
    onClickCreateQuoteForCustomer,
    handleProductChange,
    combinedData,
    selectedProduct,
    addDocumentItemFromMaterial,
    getDocumentItemDataFromMaterial,
    handleClose,
    handleClick,
    isDisabled,
    anchorEl,
    _renderErrorMessage,
    open,
    id,
  };
};

export { useAddNewItem };