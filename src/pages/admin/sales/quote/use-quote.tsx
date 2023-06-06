import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widget/more-circle";
import { useQuoteGetData } from "./use-quote-get-data";

const useQuote = () => {
  const { callApi } = useGomakeAxios();
  const { customersListValue } = useQuoteGetData();
  const { t } = useTranslation();
  const data = [
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
    {
      id: 1,
      itemName: "Flyer",
      details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: <MoreMenuWidget />,
    },
  ];
  const tableHeaders = [
    "ID",
    "Item name",
    "Details",
    "Amount",
    "Unit price",
    "Discount",
    "Final price",
    "More",
  ];
  const tableRowPercent = [
    "35px",
    "80px",
    "315px",
    "55px",
    "70px",
    "65px",
    "75px",
    "40px",
  ];
  return { t, data, tableHeaders, tableRowPercent, customersListValue };
};

export { useQuote };
