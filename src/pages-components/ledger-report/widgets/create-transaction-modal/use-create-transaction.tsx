import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { EHttpMethod } from "@/services/api-service/enums";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export enum EAccountType {
  DEBIT = 0,
  CREDIT = 1,
}

const useCreateNewTransaction = ({ onCloseModal }) => {
  const { t } = useTranslation();
  const dateRef = useRef(null);
  const dueDateRef = useRef(null);

  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertRequiredFields } =
    useSnackBar();

  const [fromAccountType, setFromAccountType] = useState<string>();
  const [toAccountType, setToAccountType] = useState<string>();

  const {
    renderOptions: fromRenderOptions,
    checkWhatRenderArray: fromCheckWhatRenderArray,
    isFetching: isFetchingFrom,
  } = useCustomerDropDownList({
    clientType:
      fromAccountType === "supplier"
        ? CLIENT_TYPE.SUPPLIER
        : CLIENT_TYPE.CUSTOMER,
    shouldRenderOnMount:
      fromAccountType === "supplier" || fromAccountType === "client",
    isUseRecoilState: false,
  });

  const {
    renderOptions: toRenderOptions,
    checkWhatRenderArray: toCheckWhatRenderArray,
    isFetching: isFetchingTo,
  } = useCustomerDropDownList({
    clientType:
      toAccountType === "supplier"
        ? CLIENT_TYPE.SUPPLIER
        : CLIENT_TYPE.CUSTOMER,
    shouldRenderOnMount:
      toAccountType === "supplier" || toAccountType === "client",
    isUseRecoilState: false,
  });

  const accountTypeList: { id: number; name: string }[] = [
    { id: EAccountType.DEBIT, name: t("reports.debit") },
    { id: EAccountType.CREDIT, name: t("reports.credit") },
  ];

  const [price, setPrice] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [selectDate, setSelectDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDueDate, setSelectedDueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };

  const handleClickSelectDueDate = () => {
    dueDateRef?.current?.showPicker();
  };

  const onChangeReference = (e: any) => {
    setReference(e.target.value);
  };

  const onChangePrice = (e: any) => {
    setPrice(e.target.value);
  };

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
  };

  // const getAgingReportFilter = useCallback(async () => {
  //   const res = await callApi(
  //     EHttpMethod.GET,
  //     `/v1/erp-service/receipts/get-erp-accounts`
  //   );
  //   if (res?.success) {
  //     setErpAccountsList(res.data?.data?.data);
  //   } else {
  //     alertFaultGetData();
  //   }
  // }, []);

  // useEffect(() => {
  //   getAgingReportFilter();
  // }, []);

  const onCloseAndRemoveState = () => {
    setPrice(0);
    setReference("");
    setSelectDate(new Date().toISOString().split("T")[0]);
    setSelectedDueDate(new Date().toISOString().split("T")[0]);
    setFromAccountType(null);
    setToAccountType(null);
    setToAccountCode(null);
    setToClientId(null);
    setFromClientId(null);
    setFromAccountCode(null);
    onCloseModal();
    setDescription("");
  };

  const [fromClientId, setFromClientId] = useState<string | null>(null);
  const [toClientId, setToClientId] = useState<string | null>(null);
  const [fromAccountCode, setFromAccountCode] = useState<string | null>(null);
  const [toAccountCode, setToAccountCode] = useState<string | null>(null);

  const createTransactionsApi = useCallback(async () => {
    if (
      !price ||
      !reference ||
      !selectDate ||
      !(fromAccountCode || fromClientId) ||
      !(toAccountCode || toClientId)
    ) {
      alertRequiredFields();
      return;
    }

    const transObject: Record<string, any> = {
      amount: price,
      reference: reference,
      referenceDate: selectDate,
      dueDate: selectedDueDate,
      description,
    };

    if (fromAccountCode !== null) transObject.debitId = fromAccountCode;

    if (fromClientId !== null) transObject.debitId = fromClientId;

    if (toAccountCode !== null) transObject.creditId = toAccountCode;

    if (toClientId !== null) transObject.creditId = toClientId;

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/Receipts/create-transaction`,
      transObject
    );

    if (res?.success) {
      alertSuccessAdded();
      onCloseAndRemoveState();
    } else {
      alertFaultAdded();
    }
  }, [
    price,
    reference,
    selectDate,
    selectedDueDate,
    toAccountCode,
    fromAccountCode,
    toClientId,
    fromClientId,
    description,
  ]);

  const accountTypeOptions = useMemo(
    () => [
      { label: t("reports.client"), value: "client" },
      { label: t("reports.supplier"), value: "supplier" },
      { label: t("reports.account"), value: "account" },
    ],
    [t]
  );

  const handleFromChange = (e: any, value: any) => {
    if (fromAccountType === "client" || fromAccountType === "supplier") {
      setFromClientId(value?.code ?? null); // Assuming 'code' is what backend expects
      setFromAccountCode(null);
    } else if (fromAccountType === "account") {
      setFromAccountCode(value?.code ?? null);
      setFromClientId(null);
    }
  };

  const handleToChange = (e: any, value: any) => {
    if (toAccountType === "client" || toAccountType === "supplier") {
      setToClientId(value?.code ?? null);
      setToAccountCode(null);
    } else if (toAccountType === "account") {
      setToAccountCode(value?.code ?? null);
      setToClientId(null);
    }
  };

  const handleFromTypeChange = (e: any, value: any) => {
    setFromAccountType(value?.value ?? null);
    setFromClientId(null);
    setFromAccountCode(null);
  };

  const handleToTypeChange = (e: any, value: any) => {
    setToAccountType(value?.value ?? null);
    setToAccountCode(null);
    setToClientId(null);
  };

  return {
    t,
    accountTypeList,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    handleClickSelectDueDate,
    selectedDueDate,
    setSelectedDueDate,
    dueDateRef,
    onChangeReference,
    onChangePrice,
    createTransactionsApi,
    onCloseAndRemoveState,
    accountTypeOptions,
    toAccountCode,
    fromAccountCode,
    toClientId,
    fromClientId,
    toAccountType,
    fromAccountType,
    handleFromChange,
    handleToChange,
    handleToTypeChange,
    handleFromTypeChange,
    onChangeDescription,
    description,
    fromRenderOptions,
    fromCheckWhatRenderArray,
    isFetchingFrom,
    toRenderOptions,
    toCheckWhatRenderArray,
    isFetchingTo,
  };
};

export { useCreateNewTransaction };
