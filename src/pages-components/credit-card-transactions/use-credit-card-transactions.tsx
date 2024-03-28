import {  useEffect, useRef, useState } from "react";
import { useAgentsList, useCustomerDropDownList, useGomakeAxios } from "@/hooks";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { getCreditCardTransactionsApi } from "@/services/api-service/credit-card-transactions/credit-card-transaction-api";
import { MoreMenuWidget } from "./more-circle";
import { useTranslation } from "react-i18next";

const useCreditCardTransactions = () => {
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();
  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const [customerId, setCustomerId] = useState<any>();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const { t }= useTranslation();
  const [toDate, setToDate] = useState<Date>();
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
  const [openModal, setOpenModal] = useState(false);
  const { callApi } = useGomakeAxios();
  const [selectedCreditCardTransaction, setSCreditCardTransaction] = useState<any>();
  const [pagesCount, setPagesCount] = useState(0);
  const { GetDateFormat } = useDateFormat();
  const [ModalTitle, setModalTitle] = useState<string>();
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };
  const onClickClosModal = (creditCardTransaction: any) => {
    setOpenModal(false);
  };
  const onClickOpenModal = (creditCardTransaction: any) => {
    setModalTitle(`${t("creditcardTransactions.TransfertoAnotherCustomer")}`);
    setOpenModal(true);
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
            onClickOpenModal={onClickOpenModal}
        />,
        ]);
         setallCreditCardTransaction(mapData);
         setPagesCount(Math.ceil(totalItems / (pageSize)));
      }
      
    }
    await getCreditCardTransactionsApi(callApi, callBack, {
        clientId:customer?.id,
        startDate:fromDate,
        endDate:toDate,
        pageNumber: page,
        pageSize: pageSize,
    }
    );
 
  }
  useEffect(() => {
    getAllCreditCardTransactions();
  }, [page,  pageSize]);


  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onClickClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setCustomerId(null);
    setResetDatePicker(true);

  };



  return {
    onSelectDeliveryTimeDates,
    resetDatePicker,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickClearFilter,
    onClickSearchFilter,
    page,
    customerId,
    setPage,
    pagesCount,
    openModal,
    onClickClosModal,
    ModalTitle,
    pageSize,
    handlePageSizeChange,
    tableHeaders,
    allCreditCardTransaction
  };
};

export { useCreditCardTransactions };
