import { useCallback, useState } from "react";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useTranslation } from "react-i18next";

const useLedgerReport = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation()
  const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()

  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [dataTable, setDataTable] = useState<any>([]);
  const getTableDataRows = useCallback(() => {
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
    console.log(" Ticket By Email")
  }
  const onClickPrintCard = () => {
    console.log("Print Card")
  }
  const onClickShowCard = () => {
    setShowTable(false);
    getAgingReportFilter()
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

  return {
    onSelectDeliveryTimeDates,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickCreateNewTransaction,
    onClickSendingTicketByEmail,
    onClickPrintCard,
    onClickShowCard,
    onChangeIsExtended,
    getTableDataRows,
    showTable,
    isExtended,
    resetDatePicker,
    customer,
    tableHeaders,
  };
};

export { useLedgerReport };
