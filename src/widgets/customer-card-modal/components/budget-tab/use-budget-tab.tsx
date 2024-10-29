import { useCallback, useEffect, useState } from "react";
import { EditIcon } from "@/icons";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { getAllBudgetsForClientApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getBudgetStatusText, getPaymentStatusText } from "./helpers-budget";
import { EHttpMethod } from "@/services/api-service/enums";


const useBudgetTab = (state) => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData, alertSuccessGetData, alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [budgets, setBudgets] = useState([]);

  const getClientOrderItems = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setBudgets(res.data);
        alertSuccessGetData();
      } else {
        alertFaultGetData();
      }
    };
    await getAllBudgetsForClientApi(callApi, callBack, {
      clientId: state?.id,
    });


  };
  useEffect(() => {
    getClientOrderItems()
  }, [])
  const tableHeaders = [
    "Budget Name",
    "VAT Included",
    "Total",
    "Balance",
    "Invoice Number",
    "Period",
    "Payment Status",
    "Status",
    "More"
  ];

  const addBudget = useCallback(async (budget) => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/budgets/create-new-budget`,
      {
        clientId: state?.id,
        clientName: state?.name,
        ...budget,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      getClientOrderItems();
    } else {
      alertFaultAdded();
    }
  }, [state]);

  const editBudget = useCallback(async (updatedBudget) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/budgets/update-budget`,
      {
        ...updatedBudget,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      getClientOrderItems();
    } else {
      alertFaultUpdate();
    }
  }, [state]);

  const mapData = (handleEditBudget, handleViewOrders) => budgets.map((row) => [
    row.name,
    row.isAmountWithVat ? (
      <div style={{ color: "#40CC4E" }}>Yes</div>
    ) : (
      <div style={{ color: "#D92C2C" }}>No</div>
    ),
    row.amount,
    row.balance,
    row.invoiceNumber,
    `${row?.fromDate?.split("T")[0]} / ${row?.toDate?.split("T")[0]}`,
    getPaymentStatusText(row.paymentStatus),
    getBudgetStatusText(row.status),
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
      <div onClick={() => handleEditBudget(row)} style={{ cursor: "pointer" }}><EditIcon /></div>
      <div onClick={handleViewOrders} style={{ cursor: "pointer" }}><AccountTreeIcon /></div>
    </div>
  ]);

  return { tableHeaders, mapData, addBudget, editBudget, getPaymentStatusText, setBudgets, budgets };
};

export { useBudgetTab };