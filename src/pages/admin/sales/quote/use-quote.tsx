import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";

const useQuote = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const data = [
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
    {
      id: 1,
      itemName: "Flyer",
      Details:
        "this is text for product new of this current available details ",
      amount: "322",
      unitPrice: "6.00",
      discount: "0.000",
      finalPrice: "148.000",
      more: "FF",
    },
  ];
  return { t, data };
};

export { useQuote };
