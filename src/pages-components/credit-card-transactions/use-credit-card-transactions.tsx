import { useEffect, useRef, useState } from "react";
import { useAgentsList, useCustomerDropDownList, useGomakeAxios } from "@/hooks";
import { useDateFormat } from "@/hooks/use-date-format";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { getCreditCardTransactionsApi } from "@/services/api-service/credit-card-transactions/credit-card-transaction-api";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widgets/more-circle";

const useCreditCardTransactions = () => {
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();
  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const [customerId, setCustomerId] = useState<any>();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const { t } = useTranslation();
  const [toDate, setToDate] = useState<Date>();
  const tableHeaders = [
    t("creditCardTransactions.CreationDate"),
    t("creditCardTransactions.CardNumber"),
    t("creditCardTransactions.Customer"),
    t("creditCardTransactions.ReceiptNumber"),
    t("creditCardTransactions.Sum"),
    t("properties.more")
  ];
  const [allCreditCardTransaction, setAllCreditCardTransaction] = useState();
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRefundModal, setOpenRefundModal] = useState<boolean>(false);

  const { callApi } = useGomakeAxios();
  const [pagesCount, setPagesCount] = useState(0);
  const { GetDateFormat } = useDateFormat();
  const [ModalTitle, setModalTitle] = useState<string>();
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);

  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };

  const onClickClosModal = () => {
    setOpenModal(false);
  };
  const onClickOpenModal = () => {
    setOpenModal(true);
  };

  const onClickOpenRefundModal = () => {
    setOpenRefundModal(true);
  }
  const onClickCloseRefundModal = () => {
    setOpenRefundModal(false);
  }

  const onClickSearchFilter = () => {
    setPage(1);
    getAllCreditCardTransactions();
  };

  const getAllCreditCardTransactions = async () => {
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

    }
    await getCreditCardTransactionsApi(callApi, callBack, {
      clientId: customer?.id,
      startDate: fromDate,
      endDate: toDate,
      pageNumber: page,
      pageSize: pageSize,
    });
  }

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

  useEffect(() => {
    getAllCreditCardTransactions();
  }, [page, pageSize]);


  return {
    t,
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
    allCreditCardTransaction,
    openRefundModal,
    onClickCloseRefundModal
  };
};

export { useCreditCardTransactions };
