import { useGomakeAxios } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { ICallAndSetData } from "@/services/api-service/interface";
import { useCallback, useEffect, useState } from "react";

type Account = {
  accountCode: string;
  accountName: string;
  cpaAccountCode: string;
};

const useFinances = () => {
  const { callApi } = useGomakeAxios();

  const [accountName,setAccountName]=useState<string>("")
  const [accountEmail,setAccountEmail]=useState<string>("")
  const [dayOfMonth,setDayOfMonth]=useState<number>(1)

  const [accountList, setAccountList] = useState<Account[]>([]);

  const getAccountRows = useCallback(() => {
    return accountList?.map((account) => [
      account.accountCode,
      account.accountName,
      account.cpaAccountCode
    ]);
  }, [accountList]);

  const onChangeAccountName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
  }
  const onChangeAccountEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountEmail(event.target.value);
  }
  const onChangeSelectDayOfMonth = (event: React.ChangeEvent<HTMLInputElement>,value:any) => {
    setDayOfMonth(Number(value));
  }

  const getAccountsFromFinanceApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, "/v1/erp-service/-settings/get-accounts", setState, data);
}

const gettAccountsFromFinance = () => {
  const callBack = (res) => {
    if (res.success) {
      setAccountList(res.data)
    }
  };
  getAccountsFromFinanceApi(callApi, callBack).then();
};

useEffect(()=>{
  gettAccountsFromFinance()
},[])

  return {
    accountName,
    accountEmail,
    dayOfMonth,
    onChangeAccountName,
    onChangeAccountEmail,
    onChangeSelectDayOfMonth,
    getAccountRows
  };
};

export { useFinances };
