import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  useCustomerDropDownList,
  useGomakeAxios,
  useGomakeRouter,
  useSnackBar,
} from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { endOfToday, startOfYear } from "date-fns";
import { ERPDocumentsTypesEnum } from "@/enums";
import { getAndSetClientContacts } from "@/services/hooks";
import { initialFromDate } from "@/utils/helpers";
import { CLIENT_TYPE } from "@/pages/customers/enums";

interface IProps {
  clientType: CLIENT_TYPE;
  customerId?: string;
}

const useLedgerReport = ({ customerId, clientType }: IProps) => {
  const { alertFaultGetData, alertSuccessGetData, alertFault, alertSuccess } =
    useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const isPurchaseReport = clientType === CLIENT_TYPE.SUPPLIER;
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({ clientType: clientType });

  const [clientContactsValue, setClientContactsValue] = useState<any>([]);

  const getAllClientContacts = useCallback(async () => {
    await getAndSetClientContacts(callApi, setClientContactsValue, {
      ClientId: customerId ? customerId : customer?.id,
    });
  }, [customer, customerId]);

  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

  const startOfPreviousYear = () => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear - 1, 0, 1); // January 1st of the previous year
  };

  const [fromDate, setFromDate] = useState<Date>(
    initialFromDate("ledger-report-date", startOfPreviousYear())
  );
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [dataTable, setDataTable] = useState<any>([]);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [isopenEmailModal, setIsOpenEmailModal] = useState<boolean>(false);
  const [isopenAdjustmentsModal, setIsOpenAdjustmentsModal] =
    useState<boolean>(false);
  const [isopenCreateTransactionModal, setIsCreateTransactionModal] =
    useState<boolean>(false);
  const [clientPaymentsList, setClientPaymentsList] = useState<any>([]);

  const onClickCloseCreateTransactionModal = () => {
    setIsCreateTransactionModal(false);
  };
  const onClickOpenCreateTransactionModal = () => {
    setIsCreateTransactionModal(true);
  };

  const onClickCloseEmailModal = () => {
    setIsOpenEmailModal(false);
  };
  const onClickOpenEmailModal = () => {
    if (customer?.id || customerId) {
      setIsOpenEmailModal(true);
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  const onClickCloseAdjustmentsModal = () => {
    setIsOpenAdjustmentsModal(false);
    setClientPaymentsList([]);
    setHasFetchedPaymentsOnce(false);
  };

  const onClickOpenAdjustmentsModal = () => {
    if (customer?.id || customerId) {
      setIsOpenAdjustmentsModal(true);
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  const onChangeUpdateClientContact = useCallback(
    (filedName: string, value: any) => {
      setSelectedContactById((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [selectedContactById]
  );
  const getTableDataRows = useCallback(() => {
    if (dataTable?.length) {
      return dataTable?.map((data) => {
        let documentPath;

        // Determine documentPath based on docType
        switch (data?.docType) {
          case ERPDocumentsTypesEnum.invoice:
            documentPath = "invoices";
            break;
          case ERPDocumentsTypesEnum.invoiceRefund:
            documentPath = "invoiceRefunds";
            break;
          case ERPDocumentsTypesEnum.receipt:
            documentPath = "receipts";
            break;
          case ERPDocumentsTypesEnum.journalEntry:
            documentPath = "receipts";
            break;
          default:
            documentPath = null; // or you can use an empty string ''
        }
        return [
          data?.docDate?.split("T")[0],
          data?.dueDate?.split("T")[0],
          data?.accountName,
          documentPath ? (
            <a
              style={{
                cursor: "pointer",
                color: "inherit",
                textDecoration: "unset",
              }}
              href={`/${documentPath}?finalPatternSearch=${data?.docNumber}&pageNumber=1`}
            >
              {data?.docNumber}
            </a>
          ) : (
            <span>{data?.docNumber}</span>
          ),
          data?.accountCode,
          data?.remarks,
          data?.transNumber,
          data?.debit.toFixed(2),
          data?.credit.toFixed(2),
          data?.balance.toFixed(2),
        ];
      });
    }
  }, [dataTable]);

  const tableHeaders = [
    t("reports.documentDate"),
    t("reports.dueDate"),
    t("reports.accountName"),
    t("reports.documentNumber"),
    t("reports.AccountCode"),
    t("reports.details"),
    t("reports.TransNumber"),
    t("reports.debit"),
    t("reports.credit"),
    t("reports.balance"),
  ];
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const onChangeIsExtended = () => {
    setIsExtended(!isExtended);
  };
  const onClickCreateNewTransaction = () => {
    onClickOpenCreateTransactionModal();
  };
  const onClickSendingTicketByEmail = () => {
    onClickOpenEmailModal();
  };
  const onClickPrintCard = () => {
    ExportLedgerReportPDF();
  };
  const onClickAdjustments = () => {
    onClickOpenAdjustmentsModal();
  };
  const onClickShowCard = () => {
    if (customer?.id || customerId) {
      setShowTable(false);
      getAgingReportFilter();
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };
  const ExportLedgerReportPDF = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    if (!customerId && !customer) {
      alertFault("reports.pleaseSelectCustomer");
      return;
    }
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-ledger-report-pdf`,
      {
        clientId: customerId ? customerId : customer?.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isExtended: isExtended,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      },
      true,
      null
    );
    const pdfLink = res?.data?.data?.data;
    downloadPdf(pdfLink);
  }, [fromDate, toDate, customer, isExtended, customerId]);
  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  const getAgingReportFilter = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-customer-ledger-report`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customerId ? customerId : customer?.id,
        isExtended: isExtended,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success) {
      setDataTable(res.data?.data?.data);
      alertSuccessGetData();
      setShowTable(true);
    } else {
      alertFaultGetData();
      setShowTable(false);
    }
  }, [fromDate, toDate, isExtended, customer, customerId]);

  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [hasFetchedPaymentsOnce, setHasFetchedPaymentsOnce] = useState(false);

  const getClientPaymentItems = useCallback(async () => {
    setIsLoadingPayments(true);
    setHasFetchedPaymentsOnce(false);

    const res = await callApi(
      EHttpMethod.GET,
      `/v1/erp-service/receipts/get-client-payment-items`,
      {
        clientId: customerId ? customerId : customer?.id,
      }
    );
    setIsLoadingPayments(false);
    setHasFetchedPaymentsOnce(true);

    if (res?.success) {
      let data = res.data?.data?.data;
      if (data?.length > 0) {
        const newData = data?.map((item) => ({
          ...item,
          fixedPrice:
            item?.totalPrice?.toFixed(2) ??
            (item?.creditOrDebit === 1
              ? Math.abs(item?.price)?.toFixed(2)
              : -Math.abs(item?.price)?.toFixed(2)),

          price:
            item?.creditOrDebit === 1
              ? Math.abs(item?.price)?.toFixed(2)
              : -Math.abs(item?.price)?.toFixed(2),
        }));
        setClientPaymentsList(newData);
        alertSuccessGetData();
      } else {
        setClientPaymentsList([]);
        // setIsOpenAdjustmentsModal(false);
        // alertFault("reports.noData");
      }
    } else {
      setClientPaymentsList([]);
      alertFaultGetData();
    }
  }, [customer, customerId]);

  useEffect(() => {
    if ((customer?.id || customerId) && isopenAdjustmentsModal) {
      getClientPaymentItems();
    }
  }, [customer, isopenAdjustmentsModal, customerId]);

  useEffect(() => {
    if (customer?.id || customerId) {
      getAllClientContacts();
    }
  }, [customer, customerId]);

  const SendCustomerLedgerToMailApi = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/send-customer-ledger-to-mail`,
      {
        clientId: customerId ? customerId : customer?.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isExtended: isExtended,
        mail: selectedContactById?.mail,
      }
    );
    if (res?.success) {
      alertSuccess("reports.sendEmailSuccess");
      onClickCloseEmailModal();
    } else {
      alertFault("reports.sendEmailFailed");
    }
  }, [fromDate, toDate, isExtended, customer, selectedContactById]);

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("ledger-report-date", value[0]);
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const [erpAccountsList, setErpAccountsList] = useState([]);

  const getErpAccountsList = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.GET,
      `/v1/erp-service/receipts/get-erp-accounts`
    );
    if (res?.success) {
      setErpAccountsList(res.data?.data?.data || []);
    } else {
      alertFaultGetData();
    }
  }, []);

  return {
    t,
    onSelectDeliveryTimeDates,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickCreateNewTransaction,
    onClickSendingTicketByEmail,
    onClickPrintCard,
    onClickShowCard,
    onClickAdjustments,
    onChangeIsExtended,
    getTableDataRows,
    onClickCloseEmailModal,
    setSelectedContactById,
    onChangeUpdateClientContact,
    onClickCloseAdjustmentsModal,
    getClientPaymentItems,
    SendCustomerLedgerToMailApi,
    onClickCloseCreateTransactionModal,
    isopenCreateTransactionModal,
    isExtended,
    showTable,
    resetDatePicker,
    customer,
    tableHeaders,
    isopenEmailModal,
    clientContactsValue,
    selectedContactById,
    isopenAdjustmentsModal,
    clientPaymentsList,
    setClientPaymentsList,
    handleDateChange,
    fromDate,
    toDate,
    customerId,
    isFetching,
    erpAccountsList,
    getErpAccountsList,
    isPurchaseReport,
    hasFetchedPaymentsOnce,
    isLoadingPayments,
  };
};

export { useLedgerReport };
