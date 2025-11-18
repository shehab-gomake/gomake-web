import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { useRecoilState } from "recoil";
import { quoteItemState, selectedFirstMaterialState } from "@/store";
import {
  addDocumentItemFromMaterialApi,
  addDocumentItemFromMaterialRowApi,
  getDocumentItemDataFromMaterialApi,
  getDocumentItemDataFromRowMaterialApi,
} from "@/services/api-service/materials/materials-endpoints";
import { v4 as uuidv4 } from "uuid";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import {
  addGenericProductToDocumentApi,
  addItemApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useUserPermission } from "@/hooks/use-permission";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { ItemCalculationType } from "@/enums";

const useAddNewItem = ({ onClose, getQuote, documentType, getCalculateQuoteItem, isMaterial, isNewCreation, isPurchaseOrder, isCanIntake }: {
  onClose: () => void, getQuote: () => void,
  documentType: DOCUMENT_TYPE,
  getCalculateQuoteItem: (item: any, quantity: number, price: number, quoteValue: any, isNewCreation?: boolean) => void,
  isMaterial?: boolean,
  isNewCreation?: boolean,
  isPurchaseOrder?: boolean,
  isCanIntake?: boolean
}) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const { alertFaultAdded, alertSuccessAdded, alertFault } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const router = useRouter();
  const { CheckPermission } = useUserPermission();
  const [selectedFirstMaterial, setSelectedFirstMaterial] = useRecoilState<any>(selectedFirstMaterialState);
  const [combinedData, setCombinedData] = useState<any>([]);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [active, setActive] = useState(true);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");

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

  // Check if isMaterial is in URL query parameters
  const isMaterialInUrl = router.query.isMaterial === "true";

  // Determine if materials should be shown
  // If isCanIntake is true (after creation), show materials regardless of isMaterial
  // If isNewCreation is true, show materials only if isMaterial is true (from prop or URL)
  // Otherwise, show products
  const shouldShowMaterials = isCanIntake === true
    ? true
    : isNewCreation === true && (isMaterial === true || isMaterialInUrl);

  // Set initial tab based on shouldShowMaterials for purchase orders
  const initialTab = documentType === DOCUMENT_TYPE.purchaseOrder && shouldShowMaterials
    ? ETab.MATERIALS
    : documentType === DOCUMENT_TYPE.purchaseOrder && !shouldShowMaterials
      ? ETab.PRODUCTS
      : ETab.PRODUCTS;

  const [selectedTab, setSelectedTab] = useState<ETab>(initialTab);

  const getAllProductsAndMaterials = useCallback(
    async (clientId, clientTypeId, selectedTab) => {
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

          const attachParentReferences = (nodes, parent = null) => {
            if (!Array.isArray(nodes)) return [];

            return nodes.map((node) => {
              const newNode = { ...node, parent };
              if (newNode.children) {
                newNode.children = attachParentReferences(
                  newNode.children,
                  newNode
                );
              }
              return newNode;
            });
          };

          const transformedProducts = transformProducts(res?.data?.products);
          const transformedMaterials = transformMaterials(res?.data?.materials);

          // Attach parent references for proper search functionality
          transformedProducts.children = attachParentReferences(
            transformedProducts.children,
            transformedProducts
          );
          transformedMaterials.children = attachParentReferences(
            transformedMaterials.children,
            transformedMaterials
          );

          // Check if isMaterial is in URL query parameters
          const isMaterialInUrl = router.query.isMaterial === "true";

          // Determine if materials should be shown
          // If isCanIntake is true (after creation), show materials regardless of isMaterial
          // If isNewCreation is true, show materials only if isMaterial is true (from prop or URL)
          // Otherwise, show products
          const shouldShowMaterials = isCanIntake === true
            ? true
            : isNewCreation === true && (isMaterial === true || isMaterialInUrl);

          // Filter data based on purchase order type and material visibility
          let combinedFinalData;
          if (documentType === DOCUMENT_TYPE.purchaseOrder) {
            if (shouldShowMaterials) {
              // Show only materials for material purchase orders
              combinedFinalData = [transformedMaterials];
            } else {
              // Show only products for product purchase orders
              combinedFinalData = [transformedProducts];
            }
          } else {
            // Combine both for other document types
            combinedFinalData = [transformedProducts, transformedMaterials];
          }
          setCombinedData(combinedFinalData);
        }
      };
      await getAllProductAndMaterialsApi(callApi, callBack, {
        clientId: clientId,
        clientTypeId: clientTypeId,
        selectionType: selectedTab,
      });
    },
    [isNewCreation, isMaterial, isPurchaseOrder, isCanIntake, documentType]
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
      setSelectedProduct({
        id: selectedValue,
        category: selectedNode?.category,
        name: selectedNode?.text,
        code: selectedNode?.code,
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

    // Use new endpoint if isCanIntake is true and it's a purchase order
    // Otherwise use the existing endpoint
    if (isCanIntake && isPurchaseOrder) {
      await addDocumentItemFromMaterialRowApi(callApi, callBack, {
        clientId: quoteItemValue?.customerID,
        printHouseMaterialId: selectedProduct?.id,
        documentType,
        documentId: quoteItemValue?.id,
      });
    } else {
      await addDocumentItemFromMaterialApi(callApi, callBack, {
        clientId: quoteItemValue?.customerID,
        printHouseMaterialId: selectedProduct?.id,
        documentId: quoteItemValue?.id,
      }, documentType);
    }

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
          // Add fields for material purchase orders
          packagesQuantity: selectedMaterial?.packagesQuantity || 0,
          quantityInPackage: selectedMaterial?.quantityInPackage || 1,
          // Include unit object when available (for purchase orders)
          ...(selectedMaterial?.unit && { unit: selectedMaterial.unit }),
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
          ItemCalculationType.UnitPrice,
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

    // Determine if we should use the new endpoint with supplierId
    // Conditions: purchaseOrder AND (isNewCreation ? isMaterial : isCanIntake)
    const shouldUseRowMaterialEndpoint =
      documentType === DOCUMENT_TYPE.purchaseOrder &&
      (isNewCreation ? isMaterial : isCanIntake);

    if (shouldUseRowMaterialEndpoint) {
      // Use the new endpoint with supplierId if available
      const supplierId = quoteItemValue?.client?.id;
      await getDocumentItemDataFromRowMaterialApi(callApi, callBack, {
        printHouseMaterialId: selectedProduct?.id,
        ...(supplierId && { supplierId }),
      });
    } else {
      // Use the original endpoint
      await getDocumentItemDataFromMaterialApi(callApi, callBack, {
        printHouseMaterialId: selectedProduct?.id,
      });
    }
  };

  // Update selectedTab when shouldShowMaterials changes
  useEffect(() => {
    // Check if isMaterial is in URL query parameters
    const isMaterialInUrl = router.query.isMaterial === "true";

    // Determine if materials should be shown
    // If isCanIntake is true (after creation), show materials regardless of isMaterial
    // If isNewCreation is true, show materials only if isMaterial is true (from prop or URL)
    // Otherwise, show products
    const shouldShowMaterials = isCanIntake === true
      ? true
      : isNewCreation === true && (isMaterial === true || isMaterialInUrl);

    if (documentType === DOCUMENT_TYPE.purchaseOrder) {
      const newTab = shouldShowMaterials ? ETab.MATERIALS : ETab.PRODUCTS;
      setSelectedTab(newTab);
    }
  }, [isNewCreation, isMaterial, isCanIntake, documentType, router.query.isMaterial]);

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
  }, [quoteItemValue?.client?.id, selectedTab, getAllProductsAndMaterials]);

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

  const onClickCreateQuoteForCustomer = () => {
    setSelectedFirstMaterial(true);
    if (router.query.isNewCreation) {
      if (selectedProduct?.category === ProductCategoryType.MATERIAL) {
        // Validate supplier selection for purchase order material items
        // Only validate when it's a purchase order, creating new, and isMaterial is true
        if (
          documentType === DOCUMENT_TYPE.purchaseOrder &&
          isMaterial &&
          !quoteItemValue?.client?.id
        ) {
          alertFault(t("home.admin.pleaseSelectSupplier"));
          // Don't close modal, let user select supplier and try again
          return;
        }
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
  };
};

export { useAddNewItem };
