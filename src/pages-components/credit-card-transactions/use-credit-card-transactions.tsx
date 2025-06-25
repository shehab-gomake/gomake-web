import { useEffect, useState } from "react";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import {
  getCreditCardTransactionsApi,
  changeTransactionClientApi,
  makeRefundApi,
} from "@/services/api-service/credit-card-transactions/credit-card-transaction-api";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widgets/more-circle";
import { format, endOfToday, endOfYear } from "date-fns";
import { initialFromDate } from "@/utils/helpers";
import { useListPagination } from "@/hooks/use-list-pagination";

const useCreditCardTransactions = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } =
    useSnackBar();
  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({});
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [allCreditCardTransaction, setAllCreditCardTransaction] =
    useState<any>();
  const [allPureTransaction, setAllPureTransaction] = useState<any>();
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRefundModal, setOpenRefundModal] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>();
  const { initialPageSize, pageSize, setPageSize, pagesCount, setPagesCount } =
    useListPagination();

  useEffect(() => {
    if (initialPageSize && initialPageSize !== pageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize]);

  const [fromDate, setFromDate] = useState<Date>(initialFromDate(""));
  const [toDate, setToDate] = useState<Date>(endOfYear(new Date()));

  const { GetDateFormat, formatISODateTime } = useDateFormat();
  const [transactionAmount, setTransactionAmount] = useState<number | "">();
  const [receiptNumber, setReceiptNumber] = useState<string>();

  const tableHeaders = [
    t("creditCardTransactions.CreationDate"),
    t("creditCardTransactions.CardNumber"),
    t("creditCardTransactions.Customer"),
    t("creditCardTransactions.ReceiptNumber"),
    t("creditCardTransactions.Sum"),
    t("properties.more"),
  ];

  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };

  const onClickClosModal = () => {
    setOpenModal(false);
  };
  const onClickOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const onClickOpenRefundModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenRefundModal(true);
  };

  const onClickCloseRefundModal = () => {
    setOpenRefundModal(false);
  };

  const onClickSearchFilter = () => {
    setPage(1);
    getAllCreditCardTransactions();
  };

  const getAllCreditCardTransactions = async (isClear: boolean = false) => {
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const callBack = (res) => {
      if (res?.success) {
        setAllPureTransaction(res.data?.data);
        const totalItems = res.data?.totalItems;
        const mapData = res.data?.data.map((item: any) => [
          formatISODateTime(item?.creationDate),
          item?.cardNumber,
          item?.clientName,
          item?.receiptNumber,
          item?.sum,
          item?.isEditable ? (
            <MoreMenuWidget
              transaction={item}
              onClickOpenModal={onClickOpenModal}
              onClickSecondModal={onClickOpenRefundModal}
            />
          ) : (
            t(`creditCardTransactions.${item?.status}`)
          ),
        ]);
        setAllCreditCardTransaction(mapData);
        setPagesCount(Math.ceil(totalItems / pageSize));
      } else {
        alertFaultGetData();
      }
    };
    await getCreditCardTransactionsApi(
      callApi,
      callBack,
      isClear
        ? {
            pageNumber: page,
            pageSize: pageSize,
          }
        : {
            clientId: customer?.id,
            receiptNumber: receiptNumber,
            sum: transactionAmount && transactionAmount,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            pageNumber: page,
            pageSize: pageSize,
          }
    );
  };

  const onClickChangeTransactionClient = async (clientID) => {
    const callBack = (res) => {
      if (res?.success) {
        const updatedTransaction = res.data;
        const updatedIndex = allPureTransaction.findIndex(
          (item) => item?.id === updatedTransaction?.id
        );
        if (updatedIndex !== -1) {
          const updatedTransactions = [...allCreditCardTransaction];
          const updatedRow = [
            GetDateFormat(updatedTransaction.creationDate),
            updatedTransaction.cardNumber,
            updatedTransaction.clientName,
            updatedTransaction.receiptNumber,
            updatedTransaction.sum,
            updatedTransaction.isEditable ? (
              <MoreMenuWidget
                transaction={updatedTransaction}
                onClickOpenModal={onClickOpenModal}
                onClickSecondModal={onClickOpenRefundModal}
              />
            ) : (
              t(`creditCardTransactions.${updatedTransaction.status}`)
            ),
          ];
          updatedTransactions[updatedIndex] = updatedRow;
          setAllCreditCardTransaction(updatedTransactions);
        }
        onClickClosModal();
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await changeTransactionClientApi(callApi, callBack, {
      id: selectedTransaction?.id,
      clientId: clientID,
    });
  };

  const onClickMakeRefund = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const updatedTransaction = res.data;
        const updatedIndex = allPureTransaction.findIndex(
          (item) => item?.id === updatedTransaction?.id
        );
        if (updatedIndex !== -1) {
          const updatedTransactions = [...allCreditCardTransaction];
          const updatedRow = [
            GetDateFormat(updatedTransaction.creationDate),
            updatedTransaction.cardNumber,
            updatedTransaction.clientName,
            updatedTransaction.receiptNumber,
            updatedTransaction.sum,
            updatedTransaction.isEditable ? (
              <MoreMenuWidget
                transaction={updatedTransaction}
                onClickOpenModal={onClickOpenModal}
                onClickSecondModal={onClickOpenRefundModal}
              />
            ) : (
              t(`creditCardTransactions.${updatedTransaction.status}`)
            ),
          ];
          updatedTransactions[updatedIndex] = updatedRow;
          setAllCreditCardTransaction(updatedTransactions);
        }
        onClickCloseRefundModal();
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await makeRefundApi(callApi, callBack, {
      transactionId: selectedTransaction?.id,
    });
  };

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
    setTransactionAmount("");
    setReceiptNumber("");
    getAllCreditCardTransactions(true);
  };

  useEffect(() => {
    getAllCreditCardTransactions();
  }, [page, pageSize]);

  const handleTransactionAmountChange = (event) => {
    setTransactionAmount(event.target.value);
  };

  const handleReceiptNumberChange = (event) => {
    setReceiptNumber(event.target.value);
  };

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("credit-card-transactions-date", value[0]);
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
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
    handleDateChange,
    fromDate,
    toDate,
    isFetching,
    initialPageSize,
    setToDate,
    setFromDate,
  };
};

export { useCreditCardTransactions };
