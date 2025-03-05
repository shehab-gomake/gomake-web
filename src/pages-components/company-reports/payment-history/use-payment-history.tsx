import { useMemo, useState } from "react";
import { getPrintHousePaymentsHistory } from "@/services/api-service/company-report/get-print-houses-report";
import { useGomakeAxios } from "@/hooks";
import { IPayment } from "@/pages-components/company-reports/payment-history/interface";
import { DateTimeComponent } from "@/components/date-time/date-time-component";
import CheckIcon from "@mui/icons-material/Check";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
const usePaymentHistory = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const { callApi } = useGomakeAxios();
  const tableHeaders = [
    "due date",
    "payment date",
    "amount",
    "manual transaction",
    "invoice number",
    "receipt number",
  ];
  const getPaymentsHistory = async (printHouseId: string) => {
    const callBack = (res) => {
      if (res.success) {
        setPayments(res.data);
      }
    };
    await getPrintHousePaymentsHistory(callApi, callBack, printHouseId);
  };

  const paymentRows = useMemo(() => {
    return payments.map((payment) => [
      <DateTimeComponent
        style={{ justifyContent: "center", alignItems: "center" }}
        dateTime={payment.dueDate}
        direction={"row"}
        gap={"3px"}
      />,
      <DateTimeComponent
        style={{ justifyContent: "center", alignItems: "center" }}
        dateTime={payment.paymentDate}
        direction={"row"}
        gap={"3px"}
      />,
      payment.amount,
      payment.manualTransaction ? <CheckIcon /> : <HorizontalRuleIcon />,
      payment.invoiceNumber,
      payment.receiptNumber,
    ]);
  }, [payments]);
  return {
    tableHeaders,
    getPaymentsHistory,
    paymentRows,
  };
};

export { usePaymentHistory };
