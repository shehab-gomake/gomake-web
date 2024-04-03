import { useEffect, useRef, useState } from "react";
import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { getCreditCardTransactionsApi, changeTransactionClientApi, makeRefundApi } from "@/services/api-service/credit-card-transactions/credit-card-transaction-api";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widgets/more-circle";

const useCreditCardTransactions = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } = useSnackBar();
  const { customer, setCustomer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [allCreditCardTransaction, setAllCreditCardTransaction] = useState();
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRefundModal, setOpenRefundModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>();
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const { GetDateFormat } = useDateFormat();
  const[transactionAmount,setTransactionAmount]=useState<string>();
  const[receiptNumber,setReceiptNumber]=useState<string>();
  
  const tableHeaders = [
    t("creditCardTransactions.CreationDate"),
    t("creditCardTransactions.CardNumber"),
    t("creditCardTransactions.Customer"),
    t("creditCardTransactions.ReceiptNumber"),
    t("creditCardTransactions.Sum"),
    t("properties.more")
  ];

  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };

  const onClickClosModal = () => {
    setOpenModal(false);
  };
  const onClickOpenModal = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenModal(true);
  };

  const onClickOpenRefundModal = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenRefundModal(true);
  }

  const onClickCloseRefundModal = () => {
    setOpenRefundModal(false);
  }

  const onClickSearchFilter = () => {
    setPage(1);
    getAllCreditCardTransactions();
  };

  const getAllCreditCardTransactions = async (isClear: boolean = false) => {
    const callBack = (res) => {
      const totalItems = res.data?.totalItems;
      if (res?.success) {
        const mapData = res.data?.data.map((item: any) => [
          GetDateFormat(item?.creationDate),
          item?.cardNumber,
          item?.clientName,
          item?.receiptNumber,
          item?.sum,
          item?.isEditable ? <MoreMenuWidget
            transaction={item}
            onClickOpenModal={onClickOpenModal}
            onClickSecondModal={onClickOpenRefundModal}

          />
            : t(`creditCardTransactions.${item?.status}`),
        ]);
        setAllCreditCardTransaction(mapData);
        setPagesCount(Math.ceil(totalItems / (pageSize)));
      }
      else {
        alertFaultGetData();
      }
    }
    await getCreditCardTransactionsApi(callApi, callBack,
      isClear ?
        {
          pageNumber: page,
          pageSize: pageSize,
        }
        :
        {
          clientId: customer?.id,
          receiptNumber: null,
          sum: 0,
          startDate: fromDate,
          endDate: toDate,
          pageNumber: page,
          pageSize: pageSize,
        });
  }

  const onClickChangeTransactionClient = async (clientID) => {
    const callBack = (res) => {
      if (res?.success) {
        getAllCreditCardTransactions();
        onClickClosModal();
        alertSuccessUpdate();
      }
      else {
        alertFaultUpdate();
      }
    }
    await changeTransactionClientApi(callApi, callBack, {
      id: selectedTransaction?.id,
      clientId: clientID,
    });
  }

  const onClickMakeRefund = async () => {
    const callBack = (res) => {
      if (res?.success) {
        onClickCloseRefundModal();
        alertSuccessUpdate();
      }
      else {
        alertFaultUpdate();

      }
    }
    await makeRefundApi(callApi, callBack, { transactionId: selectedTransaction?.id });
  }

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onClickClearFilter = () => {
    setCustomer(null);
    setFromDate(null);
    setToDate(null);
    setResetDatePicker(true);
    getAllCreditCardTransactions(true);
  };

  useEffect(() => {
    getAllCreditCardTransactions();
  }, [page, pageSize]);



  const handleTransactionAmountChange = (e: any, value: any) => {
    setTransactionAmount(value);
  };

  const handleReceiptNumberChange = (e: any, value: any) => {
    setReceiptNumber(value);
  };

  return {
    t,
    onSelectDeliveryTimeDates,
    resetDatePicker,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickClearFilter,
    onClickSearchFilter,
    page,
    setPage,
    pagesCount,
    openModal,
    onClickClosModal,
    pageSize,
    handlePageSizeChange,
    tableHeaders,
    allCreditCardTransaction,
    openRefundModal,
    onClickCloseRefundModal,
    onClickMakeRefund,
    onClickChangeTransactionClient,
    transactionAmount,
    receiptNumber,
    handleTransactionAmountChange,
    handleReceiptNumberChange,
  };
};

export { useCreditCardTransactions };
