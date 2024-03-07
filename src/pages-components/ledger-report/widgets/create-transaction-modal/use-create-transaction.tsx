import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export enum EAccountType {
  DEBIT = 0,
  CREDIT = 1,
}

const useCreateNewTransaction = ({ onCloseModal }) => {
  const { t } = useTranslation()
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange, setCustomer } = useCustomerDropDownList()
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const dateRef = useRef(null);
  const [erpAccountsList, setErpAccountsList] = useState([])
  const accountTypeList: { id: number; name: string }[] = [
    { id: EAccountType.DEBIT, name: t("reports.debit") },
    { id: EAccountType.CREDIT, name: t("reports.credit") },
  ];

  const [selectErpAccount, setErpAccount] = useState<any>()
  const [selectAccountType, setAccountType] = useState<any>()
  const [price, setPrice] = useState<number>(0)
  const [reference, setReference] = useState<string>("")
  const [selectDate, setSelectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const handleERPAccountChange = (e: any, value: any) => {
    setErpAccount(value);
  };
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  const handleAccountTypeChange = (e: any, value: any) => {
    setAccountType(value);
  };
  const onChangeReference = (e: any) => {
    setReference(e.target.value);
  };
  const onChangePrice = (e: any) => {
    setPrice(e.target.value);
  };
  const getAgingReportFilter = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/receipts/get-erp-accounts`,
      );
      if (res?.success) {
        setErpAccountsList(res.data?.data?.data)
      } else {
        alertFaultGetData()
      }
    },
    []
  );
  useEffect(() => {
    getAgingReportFilter()
  }, [])
  const onCloseAndRemoveState = () => {
    setCustomer(null)
    setErpAccount(null)
    setPrice(0)
    setReference("")
    setSelectDate(new Date().toISOString().split('T')[0])
    setAccountType(null)
    onCloseModal()
  }

  const createTransactionsApi = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/receipts/cancel-transactions`,
        {
          clientId: customer.id,
          accountCode: selectErpAccount.name,
          amount: price,
          reference: reference,
          referenceDate: selectDate,
          type: selectAccountType.id
        }
      );
      if (res?.success) {
        alertSuccessAdded()
        onCloseAndRemoveState()
      } else {
        alertFaultAdded()
      }
    },
    [customer, price, reference, selectDate, selectAccountType, selectErpAccount]
  );
  return {
    customer,
    erpAccountsList,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    selectErpAccount,
    handleERPAccountChange,
    t,
    accountTypeList,
    selectAccountType,
    handleAccountTypeChange,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    onChangeReference,
    onChangePrice,
    createTransactionsApi,
    onCloseAndRemoveState
  };
};

export { useCreateNewTransaction };
