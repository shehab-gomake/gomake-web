import { useGomakeAxios } from "@/hooks";
import { getClientOrderItemsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { TableCell, styled, tableCellClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useCopyFromOrderModal = () => {
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
  // const documentItems =
  //   [
  //     {
  //       date: "5/6/2023",
  //       id: "aa1",
  //       items: [
  //         {
  //           "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f7",
  //           "code": null,
  //           "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
  //           "details": "details 1111",
  //           "price": 3.34,
  //           "workName": "Job Name : test2",
  //           "discount": 5,
  //           "finalPrice": 317.3,
  //           "quantity": 100,
  //           "minQuantity": null,
  //           "statusString": null,
  //           "productName": "Paper Product",
  //           "isSelected": true,
  //           "productType": 0,
  //           "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
  //           "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
  //           "duplicatedFromDocumentItemId": null,
  //           "isDuplicatedWithAnotherQuantity": false,
  //           "childsDocumentItems": null,
  //           "graphicsTypes": null
  //         },
  //         {
  //           "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f8",
  //           "code": null,
  //           "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
  //           "details": "AAAAAA ",
  //           "price": 3.34,
  //           "workName": "Job Name : test2",
  //           "discount": 5,
  //           "finalPrice": 317.3,
  //           "quantity": 100,
  //           "minQuantity": null,
  //           "statusString": null,
  //           "productName": "sssssss",
  //           "isSelected": true,
  //           "productType": 0,
  //           "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
  //           "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
  //           "duplicatedFromDocumentItemId": null,
  //           "isDuplicatedWithAnotherQuantity": false,
  //           "childsDocumentItems": null,
  //           "graphicsTypes": null
  //         },
  //       ]
  //     },
  //     {
  //       date: "7/6/2023",
  //       id: "aa2",
  //       items: [
  //         {
  //           "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f3",
  //           "code": null,
  //           "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
  //           "details": "BBBBBBB ",
  //           "price": 3.34,
  //           "workName": "Job Name : test2",
  //           "discount": 5,
  //           "finalPrice": 317.3,
  //           "quantity": 100,
  //           "minQuantity": null,
  //           "statusString": null,
  //           "productName": "QQQQQ",
  //           "isSelected": true,
  //           "productType": 0,
  //           "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
  //           "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
  //           "duplicatedFromDocumentItemId": null,
  //           "isDuplicatedWithAnotherQuantity": false,
  //           "childsDocumentItems": null,
  //           "graphicsTypes": null
  //         },
  //         {
  //           "id": "7e92ebdc-24ef-4c21-9d15-484cbf4bc0f2",
  //           "code": null,
  //           "documentID": "602f6336-74e2-4478-839e-baa89da6a494",
  //           "details": "tttttt",
  //           "price": 3.34,
  //           "workName": "Job Name : test2",
  //           "discount": 5,
  //           "finalPrice": 317.3,
  //           "quantity": 100,
  //           "minQuantity": null,
  //           "statusString": null,
  //           "productName": "iiiuuh",
  //           "isSelected": true,
  //           "productType": 0,
  //           "productID": "406c0d25-3ab5-44bb-b652-621b0245d752",
  //           "clientTypeId": "89f00e94-8b22-4997-88bb-99af57cd2db0",
  //           "duplicatedFromDocumentItemId": null,
  //           "isDuplicatedWithAnotherQuantity": false,
  //           "childsDocumentItems": null,
  //           "graphicsTypes": null
  //         },

  //       ]
  //     }
  //   ]
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
    filterItems
  };
};

export { useCopyFromOrderModal };