import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";

const useLedgerReport = () => {
  const { alertFaultGetData, alertSuccessGetData, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation()
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange, getAllClientContacts, clientContactsValue } = useCustomerDropDownList()

  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [dataTable, setDataTable] = useState<any>([]);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [isopenEmailModal, setIsOpenEmailModal] = useState<boolean>(false);
  const [isopenAdjustmentsModal, setIsOpenAdjustmentsModal] = useState<boolean>(false);
  const [clientPaymentsList, setClientPaymentsList] = useState<any>([]);

  const onClickCloseEmailModal = () => {
    setIsOpenEmailModal(false);
  };
  const onClickOpenEmailModal = () => {
    if (customer?.id) {
      setIsOpenEmailModal(true);
    }
    else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };
  const onClickCloseAdjustmentsModal = () => {
    setIsOpenAdjustmentsModal(false);
  };
  const onClickOpenAdjustmentsModal = () => {
    if (customer?.id) {
      setIsOpenAdjustmentsModal(true);
    }
    else {
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
      return dataTable?.map((data) => [
        data?.docDate?.split("T")[0],
        data?.dueDate?.split("T")[0],
        data?.accountName,
        data?.docNumber,
        data?.accountCode,
        data?.remarks,
        data?.transNumber,
        data?.credit.toFixed(2),
        data?.debit.toFixed(2),
        data?.balance.toFixed(2),
      ]);
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
    t("reports.credit"),
    t("reports.debit"),
    t("reports.balance"),
  ];
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const onChangeIsExtended = () => {
    setIsExtended(!isExtended)
  }
  const onClickCreateNewTransaction = () => {
    console.log("Transaction")
  }
  const onClickSendingTicketByEmail = () => {
    onClickOpenEmailModal()
  }
  const onClickPrintCard = () => {
    console.log("Print Card")
  }
  const onClickAdjustments = () => {
    onClickOpenAdjustmentsModal()
  }
  const onClickShowCard = () => {
    if (customer?.id) {
      setShowTable(false);
      getAgingReportFilter()
    }
    else {
      alertFault("reports.pleaseSelectCustomer");
    }
  }

  const getAgingReportFilter = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-customer-ledger-report`,
        {
          startDate: fromDate,
          endDate: toDate,
          clientId: customer?.id,
          isExtended: isExtended
        }
      );
      if (res?.success) {
        setDataTable(res.data?.data?.data)
        alertSuccessGetData();
        setShowTable(true)
      } else {
        alertFaultGetData();
        setShowTable(false)
      }
    },
    [fromDate, toDate, isExtended, customer]
  );

  const getClientPaymentItems = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/receipts/get-client-payment-items`,
        {
          clientId: customer?.id,
        }
      );
      if (res?.success) {
        let data = res.data?.data?.data
        if (data?.length > 0) {
          const newData = data?.map(item => ({ ...item, fixedPrice: item.price }));
          setClientPaymentsList(newData);
          alertSuccessGetData();
        }

      } else {
        alertFaultGetData();
      }
    },
    [customer]
  );
  useEffect(() => {
    if (customer?.id && isopenAdjustmentsModal) {
      getClientPaymentItems()
    }
  }, [customer, isopenAdjustmentsModal])

  useEffect(() => {
    if (customer?.id) {
      getAllClientContacts();
    }
  }, [customer]);
  return {
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
  };
};

export { useLedgerReport };
