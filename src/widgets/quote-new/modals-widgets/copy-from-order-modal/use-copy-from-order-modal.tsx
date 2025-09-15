import { ERPDocumentsTypesEnum } from "@/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { EHttpMethod } from "@/services/api-service/enums";
import { getClientDocumentsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState, selectedItemsState } from "@/store";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useCopyFromOrderModal = ({
  onClose,
  documentType,
  openModal,
  copyFromDocumentType,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [term, setTerm] = useState("");

  const PrimaryTableCell = styled(TableCell)(() => {
    return {
      [`&.${tableCellClasses.head}`]: {
        padding: 0,
      },
      [`&.${tableCellClasses.body}`]: {
        padding: 0,
      },
    };
  });

  const [prevSelectedItems, setPrevSelectedItems] = useState([]);
  const [isAddToClicked, setIsAddToClicked] = useState(false);

  useEffect(() => {
    if (!openModal) {
      setShowReadyOnly(false);
      setShowReadyJobs(false);
      if (!isAddToClicked) {
        setSelectedItems(prevSelectedItems);
      } else {
        setIsAddToClicked(false); // Reset the flag for next tim
      }
    }
  }, [openModal]);

  const addOrdersToDeliveryNote = () => {
    setIsAddToClicked(true); // Track that the button was clicked
    setPrevSelectedItems(selectedItems); // Save current selected item
    calculateDocument();
    onClose();
  };

  const { callApi } = useGomakeAxios();
  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemsState);
  const [totalPrice, setTotalPrice] = useState(0);
  const [documentItems, setDocumentItems] = useState([]);
  const { orderId, deliveryNoteId } = router.query;
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );

  console.log("selectedItems", { selectedItems, quoteItemValue, documentItems });
  useEffect(() => {
    if (orderId) {
      setCurrentDocumentId(orderId as string);
    } else if (deliveryNoteId) {
      setCurrentDocumentId(deliveryNoteId as string);
    }
  }, [orderId, deliveryNoteId]);

  const modalLabel = () => {
    switch (copyFromDocumentType) {
      case DOCUMENT_TYPE.order:
        return t("tabs.orders");
      case DOCUMENT_TYPE.deliveryNote:
        return t("tabs.deliveryNotes");
      case DOCUMENT_TYPE.purchaseOrder:
        return t("tabs.purchaseOrders");
      default:
        return "";
    }
  };

  const noDocumentData = () => {
    switch (copyFromDocumentType) {
      case DOCUMENT_TYPE.order:
        return t("sales.cart.noOrders");
      case DOCUMENT_TYPE.deliveryNote:
        return t("sales.cart.noDeliveryNotes");
      case DOCUMENT_TYPE.purchaseOrder:
        return t("sales.cart.noOrders");
      default:
        return "";
    }
  };

  const buttonLabel = () => {
    switch (documentType) {
      case DOCUMENT_TYPE.invoice:
        return t("customers.modal.invoice");
      case DOCUMENT_TYPE.deliveryNote:
        return t("customers.modal.deliveryNote");
      case DOCUMENT_TYPE.purchaseInvoice:
        return t("sales.quote.purchaseInvoice");
      default:
        return "";
    }
  };

  const columnWidths = ["5%", "8%", "20%", "33%", "8%", "8%", "8%"];
  const tableHeaders = [
    "#",
    t("sales.quote.itemCode"),
    t("products.profits.itemName"),
    t("products.profits.details"),
    t("sales.quote.amount"),
    t("sales.quote.discount"),
    t("products.profits.pricingListWidget.unitPrice"),
    t("products.offsetPrice.admin.finalPrice"),
  ];

  const calculateTotalPrice = (fromDocumentType: DOCUMENT_TYPE) => {
    const documentTypeMapping = {
      [ERPDocumentsTypesEnum.order]: DOCUMENT_TYPE.order,
      [ERPDocumentsTypesEnum.deliveryNote]: DOCUMENT_TYPE.deliveryNote,
      [ERPDocumentsTypesEnum.purchase]: DOCUMENT_TYPE.purchaseOrder,
    };

    let total = 0;
    selectedItems
      .filter(
        (item) =>
          documentTypeMapping[item.sourceDocumentType] === fromDocumentType
      )
      .forEach((item) => {
        total += item.finalPrice;
      });

    setTotalPrice(total);
  };
  useEffect(() => {
    if (router.query.isNewCreation === "true") {
      setSelectedItems([]);
    }
  }, [router.query.isNewCreation]);
  const handleItemSelect = (item) => {
    const isAlreadySelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

    if (isAlreadySelected) {
      // If the item is already selected, remove it
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      // If the item is not selected, add it
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = (documentItem) => {
    const selectedIds = new Set(selectedItems.map((item) => item.id));
    const sectionItemIds = documentItem?.orderItems?.map((item) => item.id) || [];

    const allSelected = sectionItemIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      // If all items in the section are selected, remove them
      setSelectedItems(
        selectedItems.filter((item) => !sectionItemIds.includes(item.id))
      );
    } else {
      // If any item is not selected, add only missing items
      const newItems = documentItem?.orderItems.filter(
        (item) => !selectedIds.has(item.id)
      );
      setSelectedItems([...selectedItems, ...newItems]);
    }
  };
  const handleSelectAllDocuments = (filteredDocumentItems) => {
    if (!filteredDocumentItems || !filteredDocumentItems.length) {
      return;
    }

    // Get all items from all documents
    const allDocumentItems = filteredDocumentItems.flatMap(doc => doc.orderItems || []);
    const selectedIds = new Set(selectedItems.map((item) => item.id));

    // Check if all items are selected
    const allSelected = allDocumentItems.every((item) => selectedIds.has(item.id));

    if (allSelected) {
      // If all items are selected, remove all document items
      const documentItemIds = allDocumentItems.map(item => item.id);
      setSelectedItems(
        selectedItems.filter((item) => !documentItemIds.includes(item.id))
      );
    } else {
      // If not all items are selected, add all missing items
      const newItems = allDocumentItems.filter(
        (item) => !selectedIds.has(item.id)
      );
      setSelectedItems([...selectedItems, ...newItems]);
    }
  };

  const areAllItemsSelected = (documentItemId) => {
    const documentItem = documentItems.find((item) => item.id === documentItemId);
    if (!documentItem?.orderItems?.length) {
      return false;
    }

    const documentItemIds = documentItem.orderItems.map((item) => item.id);
    return documentItemIds.every((id) =>
      selectedItems.some((selectedItem) => selectedItem.id === id)
    );
  };

  // Helper function to check if an item is already in quote's documentItems
  const isItemInQuote = (itemId) => {
    return quoteItemValue.documentItems.some((docItem) => docItem.sourceDocumentItemId === itemId);
  };

  // Helper function to check if all documents are selected
  const areAllDocumentsSelected = () => {
    if (!documentItems.length) return false;

    const allDocumentItems = documentItems.flatMap(doc => doc.orderItems || []);
    if (!allDocumentItems.length) return false;

    return allDocumentItems.every((item) =>
      selectedItems.some((selectedItem) => selectedItem.id === item.id)
    );
  };

  const { alertFaultGetData, alertWarning } = useSnackBar();
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const getClientOrderItems = async () => {
    setIsLoadingPayments(true);
    setHasFetchedOnce(false);
    let docType;
    if (copyFromDocumentType === DOCUMENT_TYPE.order) {
      docType = DOCUMENT_TYPE.order;
    } else if (copyFromDocumentType === DOCUMENT_TYPE.deliveryNote) {
      docType = DOCUMENT_TYPE.deliveryNote;
    } else if (copyFromDocumentType === DOCUMENT_TYPE.purchaseOrder) {
      docType = DOCUMENT_TYPE.purchaseOrder;
    }

    const callBack = (res) => {
      if (res?.success) {
        const updatedData = res.data
          .filter((doc) => doc.id !== currentDocumentId)
          .map((doc) => {
            const sourceDocumentNumber = doc.number;
            const sourceDocumentId = doc.id;
            const updatedOrderItems = doc.orderItems.map((item) => ({
              ...item,
              sourceDocumentNumber,
              sourceDocumentId,
            }));
            return {
              ...doc,
              orderItems: updatedOrderItems,
            };
          });
        setDocumentItems(updatedData);

        // Select only items that are already in quoteItemValue.documentItems
        const allItems = updatedData.flatMap(doc => doc.orderItems || []);
        const existingQuoteSourceItemIds = new Set(
          quoteItemValue.documentItems.map(item => item.sourceDocumentItemId)
        );

        const itemsToSelect = allItems.filter(item =>
          existingQuoteSourceItemIds.has(item.id)
        );

        setSelectedItems(itemsToSelect);
      } else {
        setDocumentItems([]);
        setSelectedItems([]);
        alertFaultGetData();
      }
    };

    await getClientDocumentsApi(callApi, callBack, {
      documentType: docType,
      clientId: quoteItemValue?.customerID,
    });

    setIsLoadingPayments(false);
    setHasFetchedOnce(true);
  };

  const calculateDocument = useCallback(async () => {
    // Get all orderItem IDs from documentItems.orderItems
    const orderItemIds = new Set();
    documentItems.forEach((docItem) => {
      docItem.orderItems?.forEach((orderItem) => {
        orderItemIds.add(orderItem.id);
      });
    });

    // Filter out existing documentItems that have sourceDocumentItemId matching current orderItems
    const existingDocumentItems = quoteItemValue.documentItems.filter((item) => {
      // Keep items that are not from the current source documents
      return !orderItemIds.has(item.sourceDocumentItemId);
    });

    // Get selectedItems that are not already in existing documentItems
    const newSelectedItems = selectedItems.filter((selectedItem) => {
      return !existingDocumentItems.some((existingItem) => existingItem.sourceDocumentItemId === selectedItem.id);
    });

    // Merge existing items with new selected items (no duplicates)
    const mergedItems = [...existingDocumentItems, ...newSelectedItems];

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/calculate-document-new`,
      {
        documentType: documentType,
        document: {
          exchangeRate:
            documentItems[0]?.exchangeRate === 0
              ? 1
              : documentItems[0]?.exchangeRate,
          totalPrice: quoteItemValue?.totalPrice,
          data: 0,
          calculationType: 0,
          totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
          discount: quoteItemValue?.discount,
          discountAmount: quoteItemValue?.discountAmount,
          totalPayment: quoteItemValue?.totalPayment,
          vat: documentItems[0]?.vat || 0.17,
          totalVAT: quoteItemValue?.totalVAT || 0.17,
          documentItems: mergedItems,
          roundPrices: quoteItemValue?.client?.roundPrices,
        },
      }
    );

    if (res?.success) {
      const _data = res?.data?.data?.data;
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.discount = _data.discount;
      updatedQuoteItemValue.discountAmount = _data.discountAmount;
      updatedQuoteItemValue.totalPayment = _data.totalPayment;
      updatedQuoteItemValue.totalPrice = _data.totalPrice;
      updatedQuoteItemValue.totalPriceAfterDiscount = _data.totalPriceAfterDiscount;
      updatedQuoteItemValue.totalVAT = _data.totalVAT;
      updatedQuoteItemValue.vat = _data.vat;
      updatedQuoteItemValue.exchangeRate = documentItems[0]?.exchangeRate;

      // Update documentItems with the merged items
      updatedQuoteItemValue.documentItems = mergedItems;
      setQuoteItemValue(updatedQuoteItemValue);
    }
  }, [quoteItemValue, selectedItems, documentType, documentItems]);

  useEffect(() => {
    calculateTotalPrice(copyFromDocumentType);
  }, [selectedItems, copyFromDocumentType]);

  useEffect(() => {
    if (openModal) {
      getClientOrderItems();
    } else {
      setHasFetchedOnce(false);
    }
  }, [quoteItemValue, openModal]);

  const isCopyFromOrder = copyFromDocumentType === DOCUMENT_TYPE.order;
  const [showReadyOnly, setShowReadyOnly] = useState<boolean>(false);

  const [showReadyJobs, setShowReadyJobs] = useState<boolean>(false);

  const filterItems = (documentItemIsReady, items) => {
    let filteredItems = items;

    // If "Show Ready Only" is on, skip documents not ready
    if (!documentItemIsReady && showReadyOnly) {
      return [];
    }

    // If "Show Ready Jobs" is on, filter items by boardMissionsIsReady
    if (showReadyJobs) {
      filteredItems = filteredItems.filter(
        (item) => item?.boardMissionsIsReady
      );
    }

    // If there's a search term, apply it
    if (term) {
      const searchTerm = term.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item?.productName?.toLowerCase()?.includes(searchTerm) ||
          item?.details?.toLowerCase()?.includes(searchTerm) ||
          item?.workName?.toLowerCase()?.includes(searchTerm) ||
          item?.sourceDocumentNumber?.toLowerCase()?.includes(searchTerm)
      );
    }

    return filteredItems;
  };

  return {
    t,
    term,
    setTerm,
    PrimaryTableCell,
    columnWidths,
    tableHeaders,
    documentItems,
    handleItemSelect,
    handleSelectAll,
    areAllItemsSelected,
    selectedItems,
    totalPrice,
    filterItems,
    addOrdersToDeliveryNote,
    quoteItemValue,
    modalLabel,
    buttonLabel,
    setShowReadyOnly,
    showReadyOnly,
    isCopyFromOrder,
    setDocumentItems,
    showReadyJobs,
    setShowReadyJobs,
    isLoadingPayments,
    hasFetchedOnce,
    noDocumentData,
    handleSelectAllDocuments,
    isItemInQuote,
    areAllDocumentsSelected
  };
};

export { useCopyFromOrderModal };
