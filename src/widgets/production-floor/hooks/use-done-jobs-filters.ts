import { useRecoilState, useRecoilValue } from "recoil";
import {
  doneJobsCustomerState,
  doneJobsAgentState,
  doneJobsProductionStatusState,
  doneJobsOrderStatusState,
  doneJobsProofTypesState,
  doneJobsIsPrintedState,
  doneJobsProductIdsState,
  doneJobsFromDateState,
  doneJobsToDateState,
  doneJobsFromDueDateState,
  doneJobsToDueDateState,
  doneJobsFromReadyDateState,
  doneJobsToReadyDateState,
} from "../state/done-jobs-filters";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { useAgentsList } from "@/hooks/use-agent-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { exampleTypeState } from "@/store/example-type";
import { ORDER_STATUSES } from "@/enums/document-type-enum";
import { useTranslation } from "react-i18next";
import { printHouseUsePrintNode } from "@/store/print-house-profile";

export const useDoneJobsFilters = () => {
  const isPrintHouseUsePrintNode = useRecoilValue(printHouseUsePrintNode);

  const [customer, setCustomer] = useRecoilState(doneJobsCustomerState);
  const [agent, setAgent] = useRecoilState(doneJobsAgentState);
  const [status, setStatus] = useRecoilState(doneJobsProductionStatusState);
  const [orderStatus, setOrderStatus] = useRecoilState(
    doneJobsOrderStatusState
  );
  const [proofTypes, setProofTypes] = useRecoilState(doneJobsProofTypesState);
  const exampleTypeValues = useRecoilValue(exampleTypeState);

  const [isPrintedState, setIsPrintedState] = useRecoilState(
    doneJobsIsPrintedState
  );
  const [productIds, setProductIds] = useRecoilState(doneJobsProductIdsState);
  const [fromDate, setFromDate] = useRecoilState(doneJobsFromDateState);
  const [toDate, setToDate] = useRecoilState(doneJobsToDateState);
  const [fromDueDate, setFromDueDate] = useRecoilState(
    doneJobsFromDueDateState
  );
  const [toDueDate, setToDueDate] = useRecoilState(doneJobsToDueDateState);
  const [fromReadyDate, setFromReadyDate] = useRecoilState(
    doneJobsFromReadyDateState
  );
  const [toReadyDate, setToReadyDate] = useRecoilState(
    doneJobsToReadyDateState
  );

  // Use existing hooks for customers and agents
  const {
    customer: dropdownCustomer,
    setCustomer: setDropdownCustomer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({
    clientType: CLIENT_TYPE.CUSTOMER,
  });

  const { agentsCategories, handleAgentChange: handleAgentSelect } =
    useAgentsList();

  const { productList: productsList } = useAllProductsDropDownList();

  // Handlers
  const handleCustomerFilter = (e: any, value: any) => {
    setCustomer(value);
    handleCustomerChange(e, value);
  };

  const handleAgentFilter = (e: any, value: any) => {
    setAgent(value);
  };

  const handleStatusChange = (e: any, value: any) => {
    setStatus(value);
  };

  const handleOrderStatusChange = (e: any, value: any) => {
    setOrderStatus(value);
  };

  const handleProofTypesChange = (values: any[]) => {
    setProofTypes(values);
  };

  const handleMultiSelectChange = (selectedIds: string[]) => {
    setProductIds(selectedIds);
  };

  const onSelectDeliveryTimeDates = (dates: [Date | null, Date | null]) => {
    setFromDate(dates[0]);
    setToDate(dates[1]);
  };

  const onSelectDueTimeDates = (dates: [Date | null, Date | null]) => {
    setFromDueDate(dates[0]);
    setToDueDate(dates[1]);
  };

  const onSelectReadyTimeDates = (dates: [Date | null, Date | null]) => {
    setFromReadyDate(dates[0]);
    setToReadyDate(dates[1]);
  };

  const onClickClearFilter = () => {
    setCustomer(null);
    setAgent(null);
    setStatus(null);
    setOrderStatus(null);
    setProofTypes([]);
    setIsPrintedState(null);
    setProductIds([]);
    setFromDate(null);
    setToDate(null);
    setFromDueDate(null);
    setToDueDate(null);
    setFromReadyDate(null);
    setToReadyDate(null);
  };

  const { t } = useTranslation();
  const orderStatuses = [
    { label: t("boardMissions.open"), value: ORDER_STATUSES.Open },
    { label: t("boardMissions.canceled"), value: ORDER_STATUSES.Canceled },
    {
      label: t("boardMissions.waitingForPayment"),
      value: ORDER_STATUSES.WaitingForPayment,
    },
    { label: t("boardMissions.paused"), value: ORDER_STATUSES.Paused },
    { label: t("boardMissions.ready"), value: ORDER_STATUSES.Ready },
  ];

  return {
    customer,
    agent,
    status,
    orderStatus,
    proofTypes,
    orderStatuses,
    exampleTypeValues,
    isPrintedState,
    setIsPrintedState,
    productIds,
    fromDate,
    toDate,
    fromDueDate,
    toDueDate,
    fromReadyDate,
    toReadyDate,
    // Dropdown helpers
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    agentsCategories,
    productsList,
    // Handlers
    handleCustomerChange: handleCustomerFilter,
    handleAgentChange: handleAgentFilter,
    handleStatusChange,
    handleOrderStatusChange,
    handleProofTypesChange,
    handleMultiSelectChange,
    onSelectDeliveryTimeDates,
    onSelectDueTimeDates,
    onSelectReadyTimeDates,
    onClickClearFilter,
    isPrintHouseUsePrintNode,
  };
};
