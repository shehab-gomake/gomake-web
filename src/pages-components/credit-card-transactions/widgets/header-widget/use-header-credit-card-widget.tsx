
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { getCreditCardTransactionsApi } from '@/services/api-service/credit-card-transactions/credit-card-transaction-api';
import { useGomakeAxios } from "@/hooks";
import { useDateFormat } from "@/hooks/use-date-format";
import { MoreMenuWidget } from "../../more-circle";
 
const useCreditCardTransactionsReportHeader = () => {
  const { t }= useTranslation();
  const tableHeaders = [
    t("creditcardTransactions.CreationDate"),
    t("creditcardTransactions.CardNumber"),
    t("creditcardTransactions.Customer"),
    t("creditcardTransactions.ReceiptNumber"),
    t("creditcardTransactions.Sum"),
    t("creditcardTransactions.status"),
    t("More"),
  ];
  const [allCreditCardTransaction, setallCreditCardTransaction] = useState();
  const [page, setPage] = useState(1);
  const [customer, setcustomer] = useState<any>();
  const { callApi } = useGomakeAxios();
  const [pagesCount, setPagesCount] = useState(0);
  const { GetDateFormat } = useDateFormat();
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };
  const onClickSearchFilter = () => {
    setPage(1);
    getAllCreditCardTransactions();
  };
  const getAllCreditCardTransactions = async () =>{
    const callBack = (res) => {
      const totalItems = res.data?.totalItems;
      if (res?.success) {
        const mapData = res.data?.data.map((item: any) => [
          GetDateFormat(item?.creationDate),
          item?.cardNumber,
          item?.clientName,  
          item?.receiptNumber,
          item?.sum,  
          t("creditcardTransactions." , `${item?.status}`), 
          <MoreMenuWidget
        />,
        ]);
        setallCreditCardTransaction(mapData);
         setPagesCount(Math.ceil(totalItems / (pageSize)));
      }
      
    }
    await getCreditCardTransactionsApi(callApi, callBack, {
        clientId:customer?.id,
        pageNumber: page,
        pageSize: pageSize,
    }
    );
 
  }
  useEffect(() => {
    getAllCreditCardTransactions();
  }, [page,  pageSize]);

  return {
    t,
    tableHeaders,
    setPage ,
    handlePageSizeChange ,
    page ,
    pagesCount , 
    pageSize,
    allCreditCardTransaction,
    onClickSearchFilter
  };
};

export { useCreditCardTransactionsReportHeader };
