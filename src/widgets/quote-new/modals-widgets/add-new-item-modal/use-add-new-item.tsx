import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { useRecoilState } from "recoil";
import { quoteItemState, selectedFirstMaterialState } from "@/store";
import {
  addDocumentItemFromMaterialApi,
  getDocumentItemDataFromMaterialApi,
} from "@/services/api-service/materials/materials-endpoints";
import { v4 as uuidv4 } from "uuid";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import {
  addCompositeProductsApi,
  addGenericProductToDocumentApi,
  addItemApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useUserPermission } from "@/hooks/use-permission";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { EProductStructureType } from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { getCompositeProductById } from "@/services/hooks/admin-side/products/get-set-product-by-id";

const useAddNewItem = ({ onClose, getQuote, documentType, getCalculateQuoteItem }) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const router = useRouter();
  const { CheckPermission } = useUserPermission();
  const [selectedFirstMaterial, setSelectedFirstMaterial] = useRecoilState<any>(selectedFirstMaterialState);
  const [combinedData, setCombinedData] = useState<any>([]);
  const [products, setProducts] = useState([]);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);

  const [active, setActive] = useState(true);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  
  // Composite products modal state
  const [compositeDialogOpen, setCompositeDialogOpen] = useState(false);
  const [compositeProducts, setCompositeProducts] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    jobName: string;
    baseQuantity: number;
    isManuallyEdited: boolean;
    isJobNameManuallyEdited: boolean;
  }>>([]);
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);
  const [mainJobName, setMainJobName] = useState<string>("");
  const [isLoadingCompositeProducts, setIsLoadingCompositeProducts] = useState(false);
  const [compositeErrors, setCompositeErrors] = useState<{
    [key: string]: {
      quantity?: string;
      jobName?: string;
    };
  }>({});
  const [isSubmittingComposite, setIsSubmittingComposite] = useState(false);

  const handleChange = (event) => {
    setActive(event.target.value === "true");
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedProduct(null);
    setProductName("");
    setProductCode("");
    setActive(true);
  };
  const [selectedTab, setSelectedTab] = useState<ETab>(ETab.PRODUCTS);

  const getAllProductsAndMaterials = useCallback(
    async (clientId, clientTypeId, selectedTab) => {
      const callBack = (res) => {
        if (res?.success) {
          setProducts(res?.data?.products || []);
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
      await getAllProductAndMaterialsApi(callApi, callBack, {
        clientId: clientId,
        clientTypeId: clientTypeId,
        selectionType: selectedTab,
      });
    },
    []
  );

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
    if (selectedNode && !selectedNode.children) {
      let matchedProduct = null;
      if (selectedNode?.category === ProductCategoryType.PRODUCT) {
        matchedProduct = products?.find((product) => product.id === selectedValue);
      }
      setSelectedProduct({
        id: selectedValue,
        category: selectedNode?.category,
        name: selectedNode?.text,
        code: selectedNode?.code,
        productStructureType: matchedProduct?.productStructureType,
      });
    } else {
      setSelectedProduct(null);
    }
  };

  const addDocumentItemFromMaterial = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        getQuote();
        //onClose();
        handleCloseModal();
      } else {
        alertFaultAdded();
      }
    };

    await addDocumentItemFromMaterialApi(callApi, callBack, {
      clientId: quoteItemValue?.customerID,
      printHouseMaterialId: selectedProduct?.id,
      documentType,
      documentId: quoteItemValue?.id,
    });
  };

  const [isDisabled, setIsDisabled] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const _renderErrorMessage = () => {
    if (active === true) {
      if (!selectedProduct?.id) {
        return t("home.admin.pleaseSelectProduct");
      }
    } else {
      if (!productCode || !productName) {
        return t("sales.cart.productCodeAndNameRequired");
      }
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

  useEffect(() => {
    const isDisabled = checkVariables(
      selectedProduct,
      active,
      productCode,
      productName
    );
    setIsDisabled(isDisabled);
  }, [selectedProduct, productCode, productName, active]);

  const checkVariables = (
    selectedProduct,
    active,
    productCode,
    productName
  ) => {
    if (active && selectedProduct?.id) {
      return false;
    }

    if (!active && productCode && productName) {
      return false;
    }

    return true;
  };

  const getDocumentItemDataFromMaterial = async () => {
    setSelectedFirstMaterial(true);
    const callBack = (res) => {
      if (res.success) {
        const selectedMaterial = res?.data;
        const materialItem = {
          id: uuidv4(),
          printHouseMaterialId: selectedMaterial?.printHouseMaterialId,
          code: selectedMaterial?.productCode,
          details: selectedMaterial?.details,
          price: selectedMaterial?.unitPrice,
          workName: "",
          discount: 0,
          finalPrice: selectedMaterial?.finalPrice || 0,
          quantity: selectedMaterial?.quantity || 0,
          productName: selectedMaterial?.productName,
          isSelected: false,
          productType: 0,
          productID: selectedMaterial?.productId,
        };

        const updatedQuoteItemValue = { ...quoteItemValue };
        const newItem = { ...materialItem };
        updatedQuoteItemValue.documentItems = [
          ...updatedQuoteItemValue.documentItems,
          newItem,
        ];
        setQuoteItemValue(updatedQuoteItemValue);
        getCalculateQuoteItem(
          newItem,
          1,
          newItem.price,
          updatedQuoteItemValue,
          true
        );
        //onClose()
        handleCloseModal();
      } else {
        alertFaultAdded();
      }
    };
    await getDocumentItemDataFromMaterialApi(callApi, callBack, {
      printHouseMaterialId: selectedProduct?.id,
    });
  };

  useEffect(() => {
    // if (quoteItemValue?.client?.id) {
    //     getAllProductsAndMaterials(
    //         quoteItemValue?.client?.id,
    //         quoteItemValue?.client?.clientTypeId,
    //         selectedTab
    //     );
    // }
    getAllProductsAndMaterials(
      quoteItemValue?.client?.id,
      quoteItemValue?.client?.clientTypeId,
      selectedTab
    );
  }, [quoteItemValue?.client?.id, selectedTab]);

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
    calculationStatus: 1,
  };

  const genericItem = {
    id: uuidv4(),
    code: productCode,
    details: "",
    price: 0,
    workName: "",
    discount: 0,
    finalPrice: 0,
    quantity: 0,
    productName: productName,
    isSelected: false,
    productType: 0,
    calculationStatus: 1,
  };

  const addItemForQuotes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
        //onClose()
        handleCloseModal();
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

  const addGenericProductToDocument = async (data) => {
    const callBack = (res) => {
      if (res?.success) {
        getQuote();
      } else {
        alertFaultAdded();
      }
    };
    await addGenericProductToDocumentApi(callApi, callBack, {
      item: {
        productName: data?.productName,
        productCode: data?.code,
        documentId: quoteItemValue?.id,
      },
      documentType: documentType,
    });
  };

  const isCompositeSelectedProduct =
    selectedProduct?.category === ProductCategoryType.PRODUCT &&
    selectedProduct?.productStructureType === EProductStructureType.COMPOSITE;

  const openCompositeDialog = async () => {
    setCompositeErrors({});
    setCompositeDialogOpen(true);

    if (selectedProduct?.id) {
      setIsLoadingCompositeProducts(true);
      try {
        const result = await getCompositeProductById(callApi, null, {
          Id: selectedProduct.id,
        });

        let productsData = null;
        if (Array.isArray(result)) {
          productsData = result;
        } else if (result?.data) {
          productsData = Array.isArray(result.data) ? result.data : result.data.data;
        }

        if (productsData && Array.isArray(productsData)) {
          const baseQty = productsData[0]?.quantity || 1;
          const products = productsData.map((product: any) => ({
            id: product.id,
            name: product.name,
            baseQuantity: product.quantity || 1,
            quantity: product.quantity || 1,
            jobName: product.jobName || "",
            isManuallyEdited: false,
            isJobNameManuallyEdited: false,
          }));
          setCompositeProducts(products);
          setQuantityMultiplier(1);
        } else {
          setCompositeProducts([]);
          setQuantityMultiplier(1);
        }
      } catch (error) {
        console.error("Error fetching composite products:", error);
        setCompositeProducts([]);
      } finally {
        setIsLoadingCompositeProducts(false);
      }
    }
  };

  const handleCompositeCancel = () => {
    if (isSubmittingComposite) {
      return;
    }
    setCompositeDialogOpen(false);
    setCompositeErrors({});
    setCompositeProducts([]);
    setQuantityMultiplier(1);
    setMainJobName("");
  };

  const handleMainJobNameChange = (value: string) => {
    setMainJobName(value);
    setCompositeProducts((prev) =>
      prev.map((product) => {
        if (!product.isJobNameManuallyEdited) {
          return {
            ...product,
            jobName: value,
          };
        }
        return product;
      })
    );
  };

  const handleMultiplierChange = (value: number) => {
    setQuantityMultiplier(value);
    setCompositeProducts((prev) =>
      prev.map((product) => ({
        ...product,
        quantity: product.baseQuantity * value,
        isManuallyEdited: false,
      }))
    );
  };

  const handleProductQuantityChange = (index: number, value: number) => {
    setCompositeProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: value,
        isManuallyEdited: true,
      };
      return updated;
    });

    if (compositeErrors[`${index}`]?.quantity) {
      setCompositeErrors((prev) => {
        const updated = { ...prev };
        if (updated[`${index}`]) {
          const productErrors = { ...updated[`${index}`] };
          delete productErrors.quantity;
          if (Object.keys(productErrors).length === 0) {
            delete updated[`${index}`];
          } else {
            updated[`${index}`] = productErrors;
          }
        }
        return updated;
      });
    }
  };

  const updateCompositeProduct = (index: number, field: "jobName", value: string) => {
    setCompositeProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        isJobNameManuallyEdited: true,
      };
      return updated;
    });

    if (compositeErrors[`${index}`]?.[field]) {
      setCompositeErrors((prev) => {
        const updated = { ...prev };
        if (updated[`${index}`]) {
          const productErrors = { ...updated[`${index}`] };
          delete productErrors[field];
          if (Object.keys(productErrors).length === 0) {
            delete updated[`${index}`];
          } else {
            updated[`${index}`] = productErrors;
          }
        }
        return updated;
      });
    }
  };

  const handleCompositeConfirm = async () => {
    const errors: { [key: string]: { quantity?: string; jobName?: string } } = {};
    let hasErrors = false;

    compositeProducts.forEach((product, index) => {
      const productErrors: { quantity?: string; jobName?: string } = {};

      if (!product.quantity || product.quantity <= 0) {
        productErrors.quantity = t("products.addProduct.admin.quantityRequired");
        hasErrors = true;
      }

      if (Object.keys(productErrors).length > 0) {
        errors[`${index}`] = productErrors;
      }
    });

    if (hasErrors) {
      setCompositeErrors(errors);
      return;
    }

    setIsSubmittingComposite(true);

    const callBack = (res: any) => {
      setIsSubmittingComposite(false);
      if (res?.success) {
        setCompositeDialogOpen(false);
        setCompositeErrors({});
        setCompositeProducts([]);
        setQuantityMultiplier(1);
        setMainJobName("");
        alertSuccessAdded();
        getQuote();
        handleCloseModal();
      } else {
        alertFaultAdded();
      }
    };

    await addCompositeProductsApi(
      callApi,
      callBack,
      {
        documentType: documentType,
        clientId: quoteItemValue?.client?.id || quoteItemValue?.customerID,
        clientTypeId: quoteItemValue?.client?.clientTypeId,
        orderId: quoteItemValue?.id,
        compositeProducts: compositeProducts.map((p) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          jobName: p.jobName,
        })),
      }
    );
  };

  const handleCreateCompositeAware = () => {
    if (isCompositeSelectedProduct) {
      openCompositeDialog();
      return;
    }
    onClickCreateQuoteForCustomer();
  };

  const onClickCreateQuoteForCustomer = () => {
    setSelectedFirstMaterial(true);
    if (router.query.isNewCreation) {
      if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
        setSelectedFirstMaterial(true);
        getDocumentItemDataFromMaterial();
      } else {
        const updatedQuoteItemValue = { ...quoteItemValue };
        const newItem = active === true ? { ...item } : { ...genericItem };

        updatedQuoteItemValue.documentItems = [
          ...updatedQuoteItemValue.documentItems,
          newItem,
        ];
        setQuoteItemValue(updatedQuoteItemValue);
        //onClose()
        handleCloseModal();
      }
    } else {
      if (documentType === DOCUMENT_TYPE.purchaseOrder) {
        if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
          addDocumentItemFromMaterial();
        } else addItemForQuotes();
      } else {
        if (active === false) {
          addGenericProductToDocument(genericItem);
          handleCloseModal();
        } else {
          if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
            addDocumentItemFromMaterial();
          } else {
            const hasSelectedClient = !!quoteItemValue?.client?.id;
            if (hasSelectedClient) {
              const clientId = quoteItemValue?.customerID;

              const clientName = quoteItemValue?.client?.name;
              const clientTypeId = quoteItemValue?.client?.clientTypeId;

              navigate(
                `/products/create?clientTypeId=${clientTypeId}&customerId=${clientId}&customerName=${clientName}&productId=${selectedProduct?.id
                }&documentType=${documentType}${quoteItemValue?.number
                  ? `&documentNumber=${quoteItemValue?.number}`
                  : ""
                }${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
              );
            } else {
              navigate(
                `/products/create?productId=${selectedProduct?.id
                }&documentType=${documentType}${quoteItemValue?.number
                  ? `&documentNumber=${quoteItemValue?.number}`
                  : ""
                }${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
              );
            }
          }
        }
      }
    }
  };

  return {
    onClickCreateQuoteForCustomer: handleCreateCompositeAware,
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
    handleChange,
    active,
    setActive,
    productName,
    setProductName,
    productCode,
    setProductCode,
    handleCloseModal,
    CheckPermission,
    selectedTab,
    setSelectedTab,
    // Composite products
    isCompositeSelectedProduct,
    compositeDialogOpen,
    compositeProducts,
    quantityMultiplier,
    mainJobName,
    isLoadingCompositeProducts,
    compositeErrors,
    isSubmittingComposite,
    handleCompositeCancel,
    handleMainJobNameChange,
    handleMultiplierChange,
    handleProductQuantityChange,
    updateCompositeProduct,
    handleCompositeConfirm,
  };
};

export { useAddNewItem };
