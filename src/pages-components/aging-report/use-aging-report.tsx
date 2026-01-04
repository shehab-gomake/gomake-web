import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAgentsList,
  useCustomerDropDownList,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { endOfYear, format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { CLIENT_TYPE, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { getDocumentTypeName } from "../transaction-journal-report/use-transaction-journal-report";
import { DocumentsTypeReportList } from "@/enums";
import { areDatesValid, initialFromDate } from "@/utils/helpers";
import { useClientTypesList } from "@/hooks/use-client-types";
import { useModal } from "@/hooks/use-modal";
import { getAndSetClientContacts } from "@/services/hooks/cart-side/customers/get-client-contacts";
import { MessageType } from "@/pages-components/quote-new/use-quote";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import { useRecoilValue } from "recoil";

const useAgingReport = (clientType: CLIENT_TYPE) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const {
    alertFault,
    alertFaultGetData,
    alertSuccessGetData,
    alertSuccessSend,
    alertFaultSend,
  } = useSnackBar();
  const isPurchaseReport = clientType === CLIENT_TYPE.SUPPLIER;
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({ clientType });
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const isSendPaymentModal = useModal();
  const isWhatsAppModal = useModal();
  const isSendToAllClientsModal = useModal();
  const isSendPaymentDebitsModal = useModal();

  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const [selectDate, setSelectDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [byReferenceDate, setByReferenceDate] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  const [agingReportByCreationDate, setAgingReportByCreationDate] =
    useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableHeader, setTableHeader] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);

  const [fromDate, setFromDate] = useState<Date>(initialFromDate(""));
  const [toDate, setToDate] = useState<Date>(endOfYear(new Date()));

  // New states and logic for handling customer modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForEdit, setCustomerForEdit] = useState(null);

  const [clientContactsValue, setClientContactsValue] = useState<any>([]);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [availableDebits, setAvailableDebits] = useState<any[]>([]);
  const [isLoadingDebits, setIsLoadingDebits] = useState<boolean>(false);

  // FrontDesk email integration state
  const [isFrontDeskEmailComposerOpen, setIsFrontDeskEmailComposerOpen] = useState(false);
  const [frontDeskEmailData, setFrontDeskEmailData] = useState<any>(null);
  const [isLoadingFrontDeskEmailData, setIsLoadingFrontDeskEmailData] = useState(false);

  const transformedHeaders = tableHeader?.map((header) => {
    const containsNumber = /\d/.test(header.key);
    return {
      ...header,
      name: containsNumber ? header.name : t(`reports.${header.key}`),
    };
  });

  const dateRef = useRef(null);
  const [orderBy, setOrderBy] = useState<string>("cardCode");
  const [isDescOrder, setIsDescOrder] = useState<boolean>(true);

  const handleSortAgingReport = (key: string) => {
    setOrderBy(key);
    setIsDescOrder(!isDescOrder);
    getAgingReportFilter(
      detailedReport,
      agingReportByCreationDate,
      key,
      isDescOrder
    );
  };

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("aging-report-date", value[0]);
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };

  const onChangeDetailedReport = () => {
    setDetailedReport(!detailedReport);
    setShowTable(false);
    getAgingReportFilter(!detailedReport, agingReportByCreationDate);
  };
  const onChangeAgingReportByCreationDate = () => {
    setAgingReportByCreationDate(!agingReportByCreationDate);
    setShowTable(false);
    getAgingReportFilter(detailedReport, !agingReportByCreationDate);
  };
  const onChangeByReferenceDate = () => {
    setByReferenceDate(!byReferenceDate);
  };

  const getTableDataRows = useCallback(
    (onClickOpenCustomerModal) => {
      return tableData?.flatMap((data: any) => {
        const rows = [];

        // Main row without totals
        const mainRow = tableHeader.map((header: any) => {
          const nestedKey = header.key;
          const value = nestedKey
            .split(".")
            .reduce((acc, part) => acc && acc[part], data);

          if (nestedKey === "cardName") {
            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onClickOpenCustomerModal(data?.clientId)}
              >
                {value}
              </div>
            );
          }

          // Hide total values in the main row
          if (
            [
              "balanceDue",
              "_0to30",
              "_31to60",
              "_61to90",
              "_91to120",
              "_120plus",
            ].includes(nestedKey) &&
            detailedReport
          ) {
            return "";
          }

          return value || "";
        });
        rows.push(mainRow);

        // Add detailed rows
        if (Array.isArray(data.data) && detailedReport) {
          rows.push(
            ...data.data.map((nestedItem: any) => {
              return tableHeader.map((header: any, index: number) => {
                if (index < 3) return "";
                const nestedValue = header.key
                  .split(".")
                  .reduce((acc, part) => acc && acc[part], nestedItem);
                if (header.key === "docNumber") {
                  let documentPath;
                  switch (nestedItem?.docType) {
                    case DocumentsTypeReportList.Invoice:
                      documentPath = "invoices";
                      break;
                    case DocumentsTypeReportList.InvoiceRefund:
                      documentPath = "invoiceRefunds";
                      break;
                    case DocumentsTypeReportList.PurchaseInvoice:
                      documentPath = "purchaseInvoices";
                      break;
                    case DocumentsTypeReportList.PurchaseInvoiceRefund:
                      documentPath = "purchaseInvoiceRefunds";
                      break;
                    case DocumentsTypeReportList.Payments:
                      documentPath = "receipts";
                      break;
                    default:
                      documentPath = null;
                  }
                  return (
                    <>
                      {documentPath ? (
                        <a
                          style={{
                            cursor: "pointer",
                            color: "inherit",
                            textDecoration: "unset",
                          }}
                          href={`/${documentPath}?finalPatternSearch=${nestedValue}&pageNumber=1`}
                        >
                          {nestedValue}
                        </a>
                      ) : (
                        <span>{nestedValue}</span>
                      )}
                    </>
                  );
                }
                if (header.key === "type") {
                  return getDocumentTypeName(t, nestedItem?.docType);
                }
                return nestedValue || "";
              });
            })
          );
        }

        // Add totals row
        if (detailedReport) {
          const totalsRow = tableHeader.map((header: any, index: number) => {
            if (index === 0) return " "; // Add "isTotal" to the first column
            const nestedKey = header.key;
            if (
              [
                "balanceDue",
                "_0to30",
                "_31to60",
                "_61to90",
                "_91to120",
                "_120plus",
              ].includes(nestedKey)
            ) {
              return data[nestedKey] || "";
            }
            return "";
          });
          rows.push(totalsRow);
        }

        return rows;
      });
    },
    [tableData, tableHeader, detailedReport]
  );
  const onClickBtn1 = () => {
    setShowTable(false);
    getAgingReportFilter(detailedReport, agingReportByCreationDate);
  };

  const onClickBtn2 = () => {
    ExportAgingReportPDF();
  };

  const onClickBtn3 = () => {
    ExportAgingReportExcel();
  };

  const onClickBtn4 = () => {
    if (customer?.id) {
      isSendPaymentModal.open();
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  const getWhatsAppMessageForAgingReport = useCallback(async () => {
    if (!customer?.id) {
      return;
    }

    if (!areDatesValid(fromDate, toDate)) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-debit-payment-whats-app-message`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customer?.id,
        referDate: selectDate ? selectDate : new Date(),
        agentId: agent?.id,
        expendedReport: detailedReport,
        byCreationDate: agingReportByCreationDate,
        orderBy,
        isDescOrder,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success && res?.data) {
      const message = res?.data?.data?.data || "";
      setWhatsappMessage(message);
      isWhatsAppModal.open();
    } else {
      alertFault("alerts.failedToGetMessage");
    }
  }, [
    customer,
    fromDate,
    toDate,
    selectDate,
    agent,
    detailedReport,
    agingReportByCreationDate,
    orderBy,
    isDescOrder,
    isPurchaseReport,
    callApi,
    isWhatsAppModal,
    alertFault,
  ]);

  const onClickBtn5 = () => {
    if (customer?.id) {
      getWhatsAppMessageForAgingReport();
    } else {
      alertFault("reports.pleaseSelectCustomer");
    }
  };

  const onClickBtn6 = () => {
    isSendToAllClientsModal.open();
  };

  const onClickBtn7 = async () => {
    if (!customer?.id) {
      alertFault("reports.pleaseSelectCustomer");
      return;
    }
    // if (!detailedReport) {
    //   alertFault("reports.pleaseEnableDetailedReport");
    //   return;
    // }

    // Open modal first
    isSendPaymentDebitsModal.open();
    setIsLoadingDebits(true);
    setAvailableDebits([]);

    try {
      // Fetch data with detailedReport always true
      if (!areDatesValid(fromDate, toDate)) {
        alertFault("alerts.pleaseEnsureDatesSelected");
        setIsLoadingDebits(false);
        isSendPaymentDebitsModal.close();
        return;
      }

      const formattedStartDate = format(fromDate, "yyyy-MM-dd");
      const formattedEndDate = format(toDate, "yyyy-MM-dd");

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-aging-report`,
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          clientId: customer?.id,
          referDate: selectDate ? selectDate : new Date(),
          agentId: agent?.id,
          expendedReport: true, // Always true for detailed report
          byCreationDate: agingReportByCreationDate,
          orderBy,
          isDescOrder,
          cardType: isPurchaseReport
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER,
        }
      );

      if (res?.success && res?.data?.data?.data?.data) {
        const fetchedTableData = res?.data?.data?.data?.data;

        // Extract debits from fetched data
        const debits: any[] = [];
        fetchedTableData.forEach((data: any) => {
          if (Array.isArray(data.data) && data.data.length > 0) {
            data.data.forEach((nestedItem: any) => {
              if (nestedItem.docNumber) {
                // Extract values using header keys (supporting nested paths)
                const getValue = (key: string) => {
                  return key.split(".").reduce((acc, part) => acc && acc[part], nestedItem);
                };

                const docNumber = getValue("docNumber");
                const balanceDue = getValue("balanceDue") || getValue("total") || nestedItem.balanceDue || nestedItem.total || 0;

                if (docNumber && (balanceDue > 0 || balanceDue < 0)) {
                  debits.push({
                    docType: nestedItem.docType || getValue("docType"),
                    docNumber: docNumber,
                    docDate: getValue("docDate") || nestedItem.docDate,
                    dueDate: getValue("dueDate") || nestedItem.dueDate,
                    total: balanceDue,
                  });
                }
              }
            });
          }
        });

        if (debits.length === 0) {
          alertFault("reports.noDebitsAvailable");
          setIsLoadingDebits(false);
          return;
        }

        setAvailableDebits(debits);
      } else {
        alertFaultGetData();
        setIsLoadingDebits(false);
        return;
      }
    } catch (error) {
      alertFaultGetData();
      setIsLoadingDebits(false);
      return;
    } finally {
      setIsLoadingDebits(false);
    }
  };

  const getAgingReportFilter = useCallback(
    async (
      expendedReport = false,
      agingReportByCreationDate = false,
      orderBy?,
      isDescOrder?
    ) => {
      if (!areDatesValid(fromDate, toDate)) {
        alertFault("alerts.pleaseEnsureDatesSelected");
        return;
      }
      const formattedStartDate = format(fromDate, "yyyy-MM-dd");
      const formattedEndDate = format(toDate, "yyyy-MM-dd");

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-aging-report`,
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          clientId: customer?.id,
          referDate: selectDate ? selectDate : new Date(),
          agentId: agent?.id,
          expendedReport: expendedReport,
          byCreationDate: agingReportByCreationDate,
          orderBy, //balanceDue  cardCode    cardName
          isDescOrder,
          cardType: isPurchaseReport
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER,
        }
      );
      if (res?.success) {
        setTableData(res?.data?.data?.data?.data);
        setTableHeader(res?.data?.data?.data?.headers);
        alertSuccessGetData();
        setShowTable(true);
      } else {
        alertFaultGetData();
        setShowTable(false);
      }
    },
    [
      fromDate,
      toDate,
      detailedReport,
      agent,
      customer,
      selectDate,
      byReferenceDate,
      agingReportByCreationDate,
    ]
  );

  const ExportAgingReportPDF = useCallback(async () => {
    if (!areDatesValid(fromDate, toDate)) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-aging-report-pdf`,
      {
        myBody: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          clientId: customer?.id,
          referDate: selectDate ? selectDate : new Date(),
          agentId: agent?.id,
          byCreationDate: agingReportByCreationDate,
          expendedReport: detailedReport,
          orderBy,
          isDescOrder,
          cardType: isPurchaseReport
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER,
        },
      },
      true,
      null
    );
    const pdfLink = res?.data?.data?.data;
    downloadPdf(pdfLink);
  }, [
    fromDate,
    toDate,
    detailedReport,
    agent,
    customer,
    selectDate,
    byReferenceDate,
    orderBy,
    isDescOrder,
    agingReportByCreationDate,
  ]);
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
  const ExportAgingReportExcel = useCallback(async () => {
    if (!areDatesValid(fromDate, toDate)) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-aging-report-excel`,
      {
        myBody: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          clientId: customer?.id,
          referDate: selectDate ? selectDate : new Date(),
          agentId: agent?.id,
          byCreationDate: agingReportByCreationDate,
          expendedReport: detailedReport,
          cardType: isPurchaseReport
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER,
        },
      },
      true,
      null,
      "blob"
    );

    const downloadLink = document.createElement("a");
    const link = URL?.createObjectURL(res.data);
    downloadLink.href = link;
    downloadLink.download = isPurchaseReport
      ? `supplier aging.xlsx`
      : `customer aging.xlsx`;
    downloadLink.click();
  }, [
    fromDate,
    toDate,
    detailedReport,
    agent,
    customer,
    selectDate,
    byReferenceDate,
    agingReportByCreationDate,
  ]);

  // New function to handle opening customer modal
  const onClickOpenCustomerModal = async (customerId: string) => {
    const callBack = (res) => {
      if (res.success) {
        setCustomerForEdit(res.data);
        setShowCustomerModal(true);
      }
    };
    await getAndSetCustomerById(callApi, callBack, { customerId });
  };

  const { getClientTypesCategories } = useClientTypesList();

  useEffect(() => {
    getClientTypesCategories(CLIENT_TYPE_Id.CUSTOMER);
  }, []);

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

  const getAllClientContacts = useCallback(async () => {
    await getAndSetClientContacts(callApi, setClientContactsValue, {
      ClientId: customer?.id,
    });
  }, [customer]);

  useEffect(() => {
    if (customer?.id) {
      getAllClientContacts();
    }
  }, [customer?.id, getAllClientContacts]);

  const sendPaymenttoClient = useCallback(async () => {
    if (!areDatesValid(fromDate, toDate)) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/send-debit-payment-to-client`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customer?.id,
        referDate: selectDate ? selectDate : new Date(),
        agentId: agent?.id,
        expendedReport: detailedReport,
        byCreationDate: agingReportByCreationDate,
        orderBy,
        isDescOrder,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
        email: selectedContactById?.mail,
      }
    );
    if (res?.success) {
      alertSuccessSend();
      isSendPaymentModal.close();
    } else {
      alertFaultSend();
    }
  }, [
    fromDate,
    toDate,
    detailedReport,
    agent,
    customer,
    selectDate,
    byReferenceDate,
    selectedContactById,
    orderBy,
    isDescOrder,
    agingReportByCreationDate,
    isPurchaseReport,
  ]);

  const sendPaymentToAllClients = useCallback(async () => {
    if (!areDatesValid(fromDate, toDate)) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/send-debit-payment-to-all-clients`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        referDate: selectDate ? selectDate : new Date(),
        agentId: agent?.id,
        expendedReport: detailedReport,
        byCreationDate: agingReportByCreationDate,
        orderBy,
        isDescOrder,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success) {
      alertSuccessSend();
      isSendToAllClientsModal.close();
    } else {
      alertFaultSend();
    }
  }, [
    fromDate,
    toDate,
    detailedReport,
    agent,
    selectDate,
    byReferenceDate,
    orderBy,
    isDescOrder,
    agingReportByCreationDate,
    isPurchaseReport,
    callApi,
    alertFault,
    alertSuccessSend,
    alertFaultSend,
    isSendToAllClientsModal,
  ]);

  const sendSelectedDebitsPayment = useCallback(
    async (data: {
      selectedDebits: any[];
      numberOfInstallments: number;
      sendBySms: boolean;
      sendByEmail: boolean;
      sendByWhatsApp: boolean;
      email: string;
      phoneNumber: string;
    }) => {
      if (!areDatesValid(fromDate, toDate)) {
        alertFault("alerts.pleaseEnsureDatesSelected");
        return;
      }

      if (!data.email && data.sendByEmail) {
        alertFault("alerts.noMail");
        return;
      }

      if ((!data.phoneNumber || data.phoneNumber.trim() === "") && (data.sendBySms || data.sendByWhatsApp)) {
        alertFault("alerts.noPhoneNumber");
        return;
      }

      // Check if FrontDesk is enabled
      if (hasFrontDeskFeature && data.sendByEmail) {
        setIsLoadingFrontDeskEmailData(true);
        // Don't open composer yet - wait for data to load
        setIsFrontDeskEmailComposerOpen(false);
        setFrontDeskEmailData(null);

        try {
          // Format dates as ISO strings for the API call
          const formattedStartDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
          const formattedEndDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
          const formattedReferDate = selectDate ? new Date(selectDate).toISOString() : new Date().toISOString();

          // Build SelectedDocuments array with DocumentNumber and TotalPayment
          const selectedDocuments = data.selectedDebits.map((debit) => ({
            documentNumber: debit.docNumber,
            amountToPay: debit.totalPayment !== undefined ? debit.totalPayment : (debit.total || 0),
          }));

          // Call the get-debits-payment-mail-data endpoint with the same payload
          const mailDataRes = await callApi(
            EHttpMethod.POST,
            `/v1/erp-service/reports/get-debits-payment-mail-data`,
            {
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              referDate: formattedReferDate,
              cardCode: (customer as any)?.customerCode || (customer as any)?.code || "",
              cardType: isPurchaseReport
                ? CLIENT_TYPE.SUPPLIER
                : CLIENT_TYPE.CUSTOMER,
              agentCode: (agent as any)?.code || 0,
              clientId: customer?.id,
              agentId: agent?.id,
              byCreationDate: agingReportByCreationDate,
              expendedReport: detailedReport,
              orderBy: orderBy,
              isDescOrder: isDescOrder,
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              numberOfPayments: data.numberOfInstallments,
              selectedDocuments: selectedDocuments,
            }
          );

          // Extract response data from nested structure
          // Response structure: { success: true, data: { data: { data: { tos, subject, body, ... } } } }
          let responseData = null;
          if (mailDataRes?.success) {
            isSendPaymentDebitsModal.close();
            // Try deeply nested structure: res.data.data.data (actual structure from API)
            if (mailDataRes.data?.data?.data &&
              typeof mailDataRes.data.data.data === 'object' &&
              !Array.isArray(mailDataRes.data.data.data) &&
              (mailDataRes.data.data.data.tos || mailDataRes.data.data.data.subject)) {
              responseData = mailDataRes.data.data.data;
            }
            // Fallback: res.data.data (if structure is different)
            else if (mailDataRes.data?.data &&
              typeof mailDataRes.data.data === 'object' &&
              !Array.isArray(mailDataRes.data.data) &&
              (mailDataRes.data.data.tos || mailDataRes.data.data.subject)) {
              responseData = mailDataRes.data.data;
            }
            // Fallback: res.data (direct structure)
            else if (mailDataRes.data &&
              typeof mailDataRes.data === 'object' &&
              !Array.isArray(mailDataRes.data) &&
              (mailDataRes.data.tos || mailDataRes.data.subject)) {
              responseData = mailDataRes.data;
            }
          }

          if (responseData) {
            const normalizeBcc = (bcc: any): string[] => {
              if (!bcc) return [];
              if (Array.isArray(bcc)) return bcc.filter(Boolean);
              if (typeof bcc === "string") return [bcc];
              return [];
            };

            const normalizedEmailData = {
              tos: Array.isArray(responseData.tos) ? responseData.tos : (responseData.tos ? [responseData.tos] : []),
              ccs: [],
              bccs: normalizeBcc(responseData.bcc),
              subject: responseData.subject || "",
              body: responseData.body || "",
              attachments: Array.isArray(responseData.attachments)
                ? responseData.attachments.map((att: any) => ({
                  id: att.id || att.filename || "attachment",
                  filename: att.filename || "attachment",
                  mimeType: att.contentType || att.mimeType || "application/pdf",
                  contentType: att.contentType || att.mimeType || "application/pdf",
                  size: att.size || 0,
                  url: att.url || "",
                  // Keep original data for reference
                  ...(att.content && { content: att.content }),
                  ...(att.data && { data: att.data }),
                }))
                : [],
              sender: responseData.sender,
              contactEmail: data.email,
              contactPhone: data.phoneNumber,
              customerId: customer?.id,
              customerName: customer?.name,
            };
            setFrontDeskEmailData(normalizedEmailData);
            // Open composer after data is loaded
            setIsFrontDeskEmailComposerOpen(true);
          } else {
            alertFault("alerts.failedToGetEmailData");
            setIsFrontDeskEmailComposerOpen(false);
          }
          setIsLoadingFrontDeskEmailData(false);
        } catch (error) {
          console.error("Error fetching email data:", error);
          alertFault("alerts.failedToGetEmailData");
          setIsLoadingFrontDeskEmailData(false);
          setIsFrontDeskEmailComposerOpen(false);
        }
        return; // Exit early, FrontDesk will handle the send
      }

      // Original flow when FrontDesk is not enabled or sendByEmail is false
      // Format dates as ISO strings
      const formattedStartDate = fromDate ? new Date(fromDate).toISOString() : new Date().toISOString();
      const formattedEndDate = toDate ? new Date(toDate).toISOString() : new Date().toISOString();
      const formattedReferDate = selectDate ? new Date(selectDate).toISOString() : new Date().toISOString();

      // Determine messageType using MessageType enum
      let messageType = MessageType.Email;
      if (data.sendByWhatsApp) {
        messageType = 2; // WhatsApp (not in MessageType enum, keep as 2)
      } else if (data.sendByEmail && data.sendBySms) {
        messageType = MessageType.Both; // Both Email and SMS
      } else if (data.sendBySms) {
        messageType = MessageType.SMS;
      } else if (data.sendByEmail) {
        messageType = MessageType.Email;
      }

      // Build SelectedDocuments array with DocumentNumber and TotalPayment
      const selectedDocuments = data.selectedDebits.map((debit) => ({
        documentNumber: debit.docNumber,
        amountToPay: debit.totalPayment !== undefined ? debit.totalPayment : (debit.total || 0),
      }));

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/send-debit-payment-to-client`,
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          referDate: formattedReferDate,
          cardCode: (customer as any)?.customerCode || (customer as any)?.code || "",
          cardType: isPurchaseReport
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER,
          agentCode: (agent as any)?.code || 0,
          clientId: customer?.id,
          agentId: agent?.id,
          byCreationDate: agingReportByCreationDate,
          expendedReport: detailedReport,
          orderBy: orderBy,
          isDescOrder: isDescOrder,
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          numberOfPayments: data.numberOfInstallments,
          messageType: messageType,
          selectedDocuments: selectedDocuments,
        }
      );
      if (res?.success) {
        alertSuccessSend();
        isSendPaymentDebitsModal.close();
      } else {
        alertFaultSend();
      }
    },
    [
      fromDate,
      toDate,
      customer,
      selectDate,
      agent,
      selectedContactById,
      isPurchaseReport,
      agingReportByCreationDate,
      detailedReport,
      orderBy,
      isDescOrder,
      callApi,
      alertFault,
      alertSuccessSend,
      alertFaultSend,
      isSendPaymentDebitsModal,
      hasFrontDeskFeature,
    ]
  );

  const closeFrontDeskEmailComposer = useCallback(() => {
    setIsFrontDeskEmailComposerOpen(false);
    setFrontDeskEmailData(null);
    // Close the send payment debits modal when closing email composer
    isSendPaymentDebitsModal.close();
  }, [isSendPaymentDebitsModal]);

  return {
    t,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickBtn1,
    onClickBtn2,
    onClickBtn3,
    onClickBtn4,
    onClickBtn5,
    onClickBtn6,
    showTable,
    detailedReport,
    setShowTable,
    setDetailedReport,
    getTableDataRows,
    onChangeDetailedReport,
    onChangeByReferenceDate,
    transformedHeaders,
    handleDateChange,
    fromDate,
    toDate,
    showCustomerModal,
    setShowCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    onClickOpenCustomerModal, // Expose the function
    isFetching,
    tableData,
    tableHeader,
    getAgingReportFilter,
    handleSortAgingReport,
    isDescOrder,
    isPurchaseReport,
    setFromDate,
    setToDate,
    agingReportByCreationDate,
    onChangeAgingReportByCreationDate,
    isSendPaymentModal,
    clientContactsValue,
    setClientContactsValue,
    selectedContactById,
    setSelectedContactById,
    onChangeUpdateClientContact,
    sendPaymenttoClient,
    isWhatsAppModal,
    whatsappMessage,
    isSendToAllClientsModal,
    sendPaymentToAllClients,
    isSendPaymentDebitsModal,
    availableDebits,
    onClickBtn7,
    sendSelectedDebitsPayment,
    isLoadingDebits,
    // FrontDesk email integration
    isFrontDeskEmailComposerOpen,
    frontDeskEmailData,
    isLoadingFrontDeskEmailData,
    closeFrontDeskEmailComposer,
  };
};

export { useAgingReport };
