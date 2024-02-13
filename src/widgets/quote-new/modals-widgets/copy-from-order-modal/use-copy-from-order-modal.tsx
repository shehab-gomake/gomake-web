import { useGomakeAxios } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getClientOrderItemsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useCopyFromOrderModal = ({ onClose, documentType }) => {
  const { t } = useTranslation();
  const [term, setTerm] = useState("")
  const filterItems = (items) => {
    if (!term) return items; // If no search term, return all items
    const searchTerm = term.toLowerCase();
    return items.filter(item =>
      item.productName.toLowerCase().includes(searchTerm) ||
      item.details.toLowerCase().includes(searchTerm)
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
    calculateDocument()
    onClose();

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
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);

  const [documentItems, setDocumentItems] = useState([])
  const { callApi } = useGomakeAxios();
  const getClientOrderItems = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setDocumentItems(res?.data);
      } else {
        setDocumentItems(null);
      }
    };
    await getClientOrderItemsApi(callApi, callBack, {
      clientId: quoteItemValue?.customerID
    });
  };
  useEffect(() => {
    getClientOrderItems()
  }, [quoteItemValue])
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const calculateTotalPrice = () => {
    let total = 0;
    selectedItems.forEach(item => {
      total += item.finalPrice;
    });
    setTotalPrice(total);
  };
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems]);
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
    const sectionItemIds = documentItem.items.map(item => item.id);
    const allSelected = sectionItemIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      // If all items in the section are selected, remove them
      const newSelectedItems = selectedItems.filter(item => !sectionItemIds.includes(item.id));
      setSelectedItems(newSelectedItems);
    } else {
      // If any item in the section is not selected, select all items in the section
      const newSelectedItems = [...selectedItems, ...documentItem.items];
      setSelectedItems(newSelectedItems);
    }
  };
  const areAllItemsSelected = (documentItemId) => {
    const selectedIds = documentItems.find(item => item.id === documentItemId)?.items?.map(item => item.id) || [];
    return documentItems.find(item => item.id === documentItemId)?.items?.every(item => selectedItems.some(selectedItem => selectedItem.id === item.id)) || false;
  };

  const calculateDocument = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/documents/calculate-document-new`,
      {
        documentType: documentType,
        document: {
          exchangeRate: documentItems[0]?.exchangeRate,
          totalPrice: quoteItemValue?.totalPrice,
          data: 0,
          calculationType: 0,
          totalPriceAfterDiscount: quoteItemValue?.totalPriceAfterDiscount,
          discount: quoteItemValue?.discount,
          discountAmount: quoteItemValue?.discountAmount,
          totalPayment: quoteItemValue?.totalPayment,
          vat: documentItems[0]?.vat,
          totalVAT: quoteItemValue?.totalVAT,
          documentItems: selectedItems.map(item => ({
            finalPrice: item.finalPrice
          }))
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
        ...updatedQuoteItemValue.documentItems,
        ...filteredSelectedItems
      ];
      setQuoteItemValue(updatedQuoteItemValue);
    } else {
    }
  }, [quoteItemValue, selectedItems, documentType, documentItems]);
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
    addOrdersToDeliveryNote
  };
};

export { useCopyFromOrderModal };