
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { t } from "i18next";
import { useState } from "react";

 
const useCreditCardTransactionsReportHeader = () => {
  const { t }= useTranslation();
  const tableHeaders = [
    t("creditcardTransactions.CreationDate"),
    t("creditcardTransactions.CardNumber"),
    t("creditcardTransactions.ReceiptNumber"),
    t("creditcardTransactions.Customer"),
    t("creditcardTransactions.Sum"),
    t("creditcardTransactions.isEditiable"),
  ];
  const [allCreditCardTransaction, setallCreditCardTransaction] = useState([]);

  return {
    t,
    tableHeaders,
  };
};

export { useCreditCardTransactionsReportHeader };
