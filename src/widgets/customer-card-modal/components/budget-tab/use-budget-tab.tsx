import { useState } from "react";
import { EditIcon } from "@/icons";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const useBudgetTab = () => {
  const [budgets, setBudgets] = useState([
    {
      budgetName: "Marketing Budget Q1",
      vatIncluded: true,
      total: "$15,000",
      balance: "$5,000",
      invoiceNumber: "INV-12345",
      period: "Jan 2024 - Mar 2024",
      paymentStatus: "Paid",
      status: "Approved",
      orders: [
        {
          orderNumber: "ORD-001",
          totalPriceWithoutVat: "$10,000",
          totalPrice: "$12,000",
          status: "Completed",
        },
        {
          orderNumber: "ORD-002",
          totalPriceWithoutVat: "$5,000",
          totalPrice: "$6,000",
          status: "In Progress",
        }
      ],
    },
    {
      budgetName: "R&D Budget Q1",
      vatIncluded: false,
      total: "$10,000",
      balance: "$2,000",
      invoiceNumber: "INV-67890",
      period: "Jan 2024 - Mar 2024",
      paymentStatus: "Pending",
      status: "Pending Approval",
      orders: [
        {
          orderNumber: "ORD-003",
          totalPriceWithoutVat: "$8,000",
          totalPrice: "$9,500",
          status: "Completed",
        }
      ],
    },
    // ... other budgets ...
  ]);

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

  const addBudget = (budget) => {
    setBudgets([...budgets, budget]);
  };

  const editBudget = (updatedBudget) => {
    setBudgets(budgets.map(budget => budget.invoiceNumber === updatedBudget.invoiceNumber ? updatedBudget : budget));
  };

  const mapData = (handleEditBudget, handleViewOrders) => budgets.map((row) => [
    row.budgetName,
    row.vatIncluded ? (
      <div style={{ color: "#40CC4E" }}>Yes</div>
    ) : (
      <div style={{ color: "#D92C2C" }}>No</div>
    ),
    row.total,
    row.balance,
    row.invoiceNumber,
    row.period,
    row.paymentStatus === "Paid" ? (
      <div style={{ color: "#40CC4E" }}>{row.paymentStatus}</div>
    ) : (
      <div style={{ color: "#D92C2C" }}>{row.paymentStatus}</div>
    ),
    row.status,
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
      <div onClick={() => handleEditBudget(row)} style={{ cursor: "pointer" }}><EditIcon /></div>
      <div onClick={() => handleViewOrders(row.orders)} style={{ cursor: "pointer" }}><AccountTreeIcon /></div>
    </div>
  ]);

  return { tableHeaders, mapData, addBudget, editBudget };
};

export { useBudgetTab };