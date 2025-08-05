import { useCallback, useEffect, useState } from "react";
import { EditIcon } from "@/icons";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
  getAllBudgetsForClientApi,
  getAllDocumentsByBudgetApi,
  getAllDocumentsByBudgetIdApi,
} from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { getBudgetStatusText, getPaymentStatusText } from "./helpers-budget";
import { EHttpMethod } from "@/services/api-service/enums";
import { useTranslation } from "react-i18next";

type Budget = {
  id: string;
  name: string;
  amount: number;
  balance: number;
  clientId: string;
  clientName: string | null;
  fromDate: string;
  toDate: string;
  paymentStatus: number;
  comments: string | null;
  invoiceNumber: string;
  status: number;
  isAmountWithVat: boolean;
  recordID: number;
};

const useBudgetTab = (state) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const {
    alertSuccessUpdate,
    alertFaultUpdate,
    alertFaultGetData,
    alertSuccessGetData,
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const [budgets, setBudgets] = useState([]);
  const [allDocumentsByBudgetId, setAllDocumentsByBudgetId] = useState([]);
  const [allDocumentsByBudget, setAllDocumentsByBudget] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newBudget, setNewBudget] = useState<Budget | null>(null);
  const path = `/invoice?isNewCreation=true&budgetId=${newBudget?.id}`;

  const [openCreateInvoiceModal, setOpenCreateInvoiceModal] =
    useState<boolean>(false);
  const onCloseCreateInvoiceModal = () => {
    setOpenCreateInvoiceModal(false);
  };
  const onOpenCreateInvoiceModal = () => {
    setOpenCreateInvoiceModal(true);
  };

  const handleAddNewBudget = () => {
    setCurrentBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  const handleViewOrders = (budget) => {
    setSelectedBudget(budget);
    getAllDocumentsByBudgetId(budget);
    setAllDocumentsByBudgetId([]);
    setIsOrdersModalOpen(true);
  };

  const getAllBudgetsForClient = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setBudgets(res.data);
        setIsDataLoaded(true);
        alertSuccessGetData();
      } else {
        setIsDataLoaded(true);
        alertFaultGetData();
      }
    };
    await getAllBudgetsForClientApi(callApi, callBack, {
      clientId: state?.id,
    });
  };

  const getAllDocumentsByBudget = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setAllDocumentsByBudget(res.data);
        alertSuccessGetData();
      } else {
        alertFaultGetData();
      }
    };
    await getAllDocumentsByBudgetApi(callApi, callBack, {
      clientId: state?.id,
    });
  };

  const getAllDocumentsByBudgetId = async (budget) => {
    const callBack = (res) => {
      if (res?.success) {
        setAllDocumentsByBudgetId(res.data);
        setIsLoadingDocuments(true);
        alertSuccessGetData();
      } else {
        alertFaultGetData();
        setIsLoadingDocuments(true);
      }
    };
    await getAllDocumentsByBudgetIdApi(callApi, callBack, {
      budgetId: budget?.id,
    });
  };

  useEffect(() => {
    getAllBudgetsForClient();
  }, []);

  useEffect(() => {
    if (isOrdersModalOpen) {
      getAllDocumentsByBudget();
    }
  }, [isOrdersModalOpen]);
  const tableHeaders = [
    t("customers.modal.budgetName"),
    t("customers.modal.vatIncluded"),
    t("deposits.total"),
    t("customers.modal.balance"),
    t("customers.modal.invoiceNumber"),
    t("customers.modal.period"),
    t("customers.modal.paymentStatus"),
    t("customers.modal.status"),
    t("customers.modal.more"),
  ];

  const addBudget = useCallback(
    async (budget) => {
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
        getAllBudgetsForClient();
        setNewBudget(res?.data?.data?.data);

        if (!res?.data?.data?.data?.invoiceNumber) {
          onOpenCreateInvoiceModal();
        }
      } else {
        alertFaultAdded();
      }
    },
    [state]
  );

  const editBudget = useCallback(
    async (updatedBudget) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/budgets/update-budget`,
        {
          ...updatedBudget,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getAllBudgetsForClient();
      } else {
        alertFaultUpdate();
      }
    },
    [state]
  );

  const mapData = (handleEditBudget, handleViewOrders) =>
    budgets.map((row) => [
      row.name,
      row.isAmountWithVat ? (
        <div style={{ color: "#40CC4E" }}>{t("modal.yes")}</div>
      ) : (
        <div style={{ color: "#D92C2C" }}>{t("modal.no")}</div>
      ),
      row.amount,
      row.balance,
      row.invoiceNumber,
      row.fromDate && row.toDate
        ? `${row.fromDate.split("T")[0]} / ${row.toDate.split("T")[0]}`
        : "",
      getPaymentStatusText(row.paymentStatus),
      getBudgetStatusText(row.status),
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          onClick={() => handleEditBudget(row)}
          style={{ cursor: "pointer" }}
        >
          <EditIcon />
        </div>
        <div
          onClick={() => handleViewOrders(row)}
          style={{ cursor: "pointer" }}
        >
          <AccountTreeIcon />
        </div>
      </div>,
    ]);

  const updateDocumentBudget = useCallback(
    async (budget) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/budgets/update-document-budget`,
        {
          documentType: budget?.documentType,
          documentId: budget?.documentId,
          budgetId: null,
        }
      );
      if (res?.success) {
        getAllDocumentsByBudgetId(selectedBudget);
        getAllBudgetsForClient();
        alertSuccessDelete();
      } else {
        alertFaultDelete();
      }
    },
    [selectedBudget]
  );

  return {
    mapData,
    addBudget,
    editBudget,
    setBudgets,
    handleViewOrders,
    handleEditBudget,
    handleAddNewBudget,
    setIsModalOpen,
    setIsOrdersModalOpen,
    updateDocumentBudget,
    tableHeaders,
    budgets,
    allDocumentsByBudgetId,
    isModalOpen,
    isOrdersModalOpen,
    currentBudget,
    allDocumentsByBudget,
    selectedBudget,
    openCreateInvoiceModal,
    path,
    isDataLoaded,
    isLoadingDocuments,
    onCloseCreateInvoiceModal,
    navigate,
    getAllBudgetsForClient,
  };
};

export { useBudgetTab };
