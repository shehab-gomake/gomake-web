import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAccountsApi } from "@/services/api-service/settings/finance-api";
import { useCallback, useEffect, useState } from "react";
import React from 'react';

type Account = {
  accountCode: string;
  accountName: string;
  cpaAccountCode: string;
};

const useFinances = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [accountList, setAccountList] = useState<Account[]>([]);


  const [accountName, setAccountName] = useState<string>("")
  const [accountEmail, setAccountEmail] = useState<string>("")
  const [dayOfMonth, setDayOfMonth] = useState<number>(1)

  const onChangeAccountName = (v : any) => {
    setAccountName(v);
  }
  const onChangeAccountEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountEmail(event.target.value);
  }
  const onChangeSelectDayOfMonth = (event: React.ChangeEvent<HTMLInputElement>, value: any) => {
    setDayOfMonth(Number(value));
  }

  const getAccountsFromFinance = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setAccountList(res?.data)
      }
      else {
        alertFaultGetData();
      }
    };
    await getAccountsApi(callApi, callBack);
  };

  const getAccountRows = useCallback(() => {
    return accountList?.map((account, index) => [
      account.accountCode,
      account.accountName,
      <input
        key={index}
        type="text"
        value={account.cpaAccountCode}
        onChange={(event) => {
          const updatedList = [...accountList];
          updatedList[index] = {
            ...updatedList[index],
            cpaAccountCode: event.target.value
          };
          setAccountList(updatedList);
        }}
      />
    ]);
  }, [accountList]);
  
  useEffect(() => {
    getAccountsFromFinance();
  }, [])

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