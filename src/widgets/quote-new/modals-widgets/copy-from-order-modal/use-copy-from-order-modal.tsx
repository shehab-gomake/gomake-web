import { useGomakeAxios } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { EHttpMethod } from "@/services/api-service/enums";
import { getClientDocumentsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useCopyFromOrderModal = ({ onClose, documentType, openModal, cliendDocumentType }) => {
  const { t } = useTranslation();
  const [term, setTerm] = useState("")
  const filterItems = (items) => {
    if (!term) return items; // If no search term, return all items
    const searchTerm = term.toLowerCase();
    return items.filter(item =>
      item?.productName?.toLowerCase()?.includes(searchTerm) ||
      item?.details?.toLowerCase()?.includes(searchTerm) ||
      item?.workName?.toLowerCase()?.includes(searchTerm)

    );
  };
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
  const addOrdersToDeliveryNote = () => {
    calculateDocument();
    onClose();
  };

  const { callApi } = useGomakeAxios();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [documentItems, setDocumentItems] = useState([]);


  const modalLabel = () => {
    switch (cliendDocumentType) {
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

  const calculateTotalPrice = () => {
    let total = 0;
    selectedItems.forEach(item => {
      total += item.finalPrice;
    });
    setTotalPrice(total);
  };

  const handleItemSelect = (item) => {
    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      // If the item is already selected, remove it
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      // If the item is not selected, add it
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = (documentItem) => {
    const selectedIds = selectedItems.map(item => item.id);
    const sectionItemIds = documentItem?.orderItems?.map(item => item.id);
    const allSelected = sectionItemIds?.every(id => selectedIds?.includes(id));

    if (allSelected) {
      // If all items in the section are selected, remove them
      const newSelectedItems = selectedItems.filter(item => !sectionItemIds.includes(item.id));
      setSelectedItems(newSelectedItems);
    } else {

      // If any item in the section is not selected, select all items in the section
      const newSelectedItems = [...selectedItems, ...documentItem?.orderItems];
      setSelectedItems(newSelectedItems);
    }
  };

  const areAllItemsSelected = (documentItemId) => {
    const selectedIds = documentItems.find(item => item.id === documentItemId)?.orderItems?.map(item => item.id) || [];
    return documentItems.find(item => item.id === documentItemId)?.orderItems?.every(item => selectedItems.some(selectedItem => selectedItem.id === item.id)) || false;
  };

  const getClientOrderItems = async () => {
    let docType;
    if (cliendDocumentType === DOCUMENT_TYPE.order) {
      docType = DOCUMENT_TYPE.order;
    } else if (cliendDocumentType === DOCUMENT_TYPE.deliveryNote) {
      docType = DOCUMENT_TYPE.deliveryNote;
    }
    else if (cliendDocumentType === DOCUMENT_TYPE.purchaseOrder) {
      docType = DOCUMENT_TYPE.purchaseOrder;
    }
    const callBack = (res) => {
      if (res?.success) {
        setDocumentItems(res?.data);
      } else {
        setDocumentItems(null);
      }
    };
    await getClientDocumentsApi(callApi, callBack, {
      documentType: docType,
      clientId: quoteItemValue?.customerID
    });


  };
  const calculateDocument = useCallback(async () => {
    const sharedDeletedArry = quoteItemValue.documentItems.filter(item => {
      const isIncludedInOrderItems = documentItems.some(docItem => {
        return docItem.orderItems.some(orderItem => orderItem.id === item.id);
      });
      const isNotIncludedInSelectedItems = !selectedItems.some(selectedItem => selectedItem.id === item.id);
      return isIncludedInOrderItems && isNotIncludedInSelectedItems;
    });
    const documentItemsFilters = quoteItemValue.documentItems.filter(item => {
      return !sharedDeletedArry.some(sharedItem => sharedItem.id === item.id);
    });
    const mergedItems = [...documentItemsFilters, ...selectedItems];
    const idMap = new Map();
    const uniqueItems = mergedItems.filter(item => {
      if (!idMap.has(item.id)) {
        idMap.set(item.id, true);
        return true;
      }
      return false;
    }).map(item => ({
      finalPrice: item.finalPrice
    }));
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/calculate-document-new`,
      {
        documentType: documentType,
        document: {
          exchangeRate: documentItems[0]?.exchangeRate === 0 ? 1 : documentItems[0]?.exchangeRate,
          totalPrice: quoteItemValue?.totalPrice,
          data: 0,
          calculationType: 0,
          totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
          discount: quoteItemValue?.discount,
          discountAmount: quoteItemValue?.discountAmount,
          totalPayment: quoteItemValue?.totalPayment,
          vat: documentItems[0]?.vat || 0.17,
          totalVAT: quoteItemValue?.totalVAT || 0.17,
          documentItems: uniqueItems
        }
      }
    );
    if (res?.success) {
      const _data = res?.data?.data?.data
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.discount = _data.discount;
      updatedQuoteItemValue.discountAmount = _data.discountAmount;
      updatedQuoteItemValue.totalPayment = _data.totalPayment;
      updatedQuoteItemValue.totalPrice = _data.totalPrice;
      updatedQuoteItemValue.totalPriceAfterDiscount = _data.totalPriceAfterDiscount;
      updatedQuoteItemValue.totalVAT = _data.totalVAT;
      updatedQuoteItemValue.vat = _data.vat;
      updatedQuoteItemValue.exchangeRate = documentItems[0]?.exchangeRate;
      const filteredSelectedItems = selectedItems.filter(selectedItem => {
        return !updatedQuoteItemValue.documentItems.some(documentItem => documentItem.id === selectedItem.id);
      });

      updatedQuoteItemValue.documentItems = [
        ...documentItemsFilters,
        ...filteredSelectedItems
      ];
      setQuoteItemValue(updatedQuoteItemValue);
    }
  }, [quoteItemValue, selectedItems, documentType, documentItems]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems]);

  useEffect(() => {
    if (openModal) {
      getClientOrderItems()
    }
  }, [quoteItemValue, openModal]);

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
    buttonLabel
  };
};

export { useCopyFromOrderModal };