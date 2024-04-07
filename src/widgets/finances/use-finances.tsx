import { UpdatedTextInput } from "@/components/text-input/updated-text-input";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAccountsApi, updateCpaAccountCodeApi, updateCpaManagerMailApi, updateCpaManagerNameApi, updateSendCpaReportApi } from "@/services/api-service/settings/finance-api";
import { useCallback, useEffect, useState } from "react";
import React from 'react';

type Account = {
  accountCode: string;
  accountName: string;
  cpaAccountCode: string;
};

const useFinances = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate, alertFaultGetData } = useSnackBar();
  const [financeState, setFinanceState] = useState<any>();
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [accountName, setAccountName] = useState<string>("")
  const [accountEmail, setAccountEmail] = useState<string>("")
  const [dayOfMonth, setDayOfMonth] = useState<string>("")

  const onChangeAccountName = (v: any) => {
    setAccountName(v);
  }
  const onResetAccountName = () => {
    setAccountName(financeState?.cpaName);
  }
  const onResetAccountMail = () => {
    setAccountEmail(financeState?.cpaMail);
  }

  const onResetDayOfMonth = () => {
    setDayOfMonth(financeState?.cpaTransmitDate);
  }

  const onChangeAccountEmail = (v) => {
    setAccountEmail(v);
  }

  const onChangeSelectDayOfMonth = (event: React.ChangeEvent<HTMLInputElement>, value: any) => {
    setDayOfMonth(value);
  }

  const [pureAccountList, setPureAccountList] = useState<Account[]>([]);

  const getAccountsFromFinance = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setFinanceState(res?.data);
        setAccountList(res?.data?.accounts);
        setPureAccountList(res?.data?.accounts);
        setAccountName(res?.data?.cpaName);
        setAccountEmail(res?.data?.cpaMail);
        setDayOfMonth(res?.data?.cpaTransmitDate?.toString());
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
      <UpdatedTextInput
        key={index}
        onInputChange={(newValue) => {
          const updatedList = [...accountList];
          updatedList[index] = {
            ...updatedList[index],
            cpaAccountCode: newValue
          };
          setAccountList(updatedList);
        }}
        onCancel={() => {
          const previousValue = pureAccountList[index].cpaAccountCode;
          //const updatedList = [...pureAccountList];
          const updatedList = [...accountList];
          updatedList[index] = {
            ...updatedList[index],
            cpaAccountCode: previousValue !== null ? previousValue : ''
          };
          setAccountList(updatedList);
        }}
        onUpdate={() => {
          onClickUpdateCpaAccountCode(account.accountCode, account.cpaAccountCode);
        }}
        value={account.cpaAccountCode}
        height="30px"
        width="120px"
        withBorder={true}
      />
    ]);
  }, [accountList]);

  const onClickUpdateCpaMangerName = async () => {
    const callBack = (res) => {
      if (res.success) {
        setFinanceState(prevState => ({
          ...prevState,
          cpaName: accountName // Update cpaName with accountName
        }));
        alertSuccessUpdate();
      }
      else {
        alertFaultUpdate();
      }
    };
    await updateCpaManagerNameApi(callApi, callBack, { mangerName: accountName });
  };

  const onClickUpdateCpaMangerMail = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setFinanceState(prevState => ({
          ...prevState,
          cpaMail: accountEmail
        }));
      }
      else {
        alertFaultUpdate();
      }
    };
    await updateCpaManagerMailApi(callApi, callBack, { mangerMail: accountEmail });
  };

  const onClickUpdateDayInMonth = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setFinanceState(prevState => ({
          ...prevState,
          cpaTransmitDate: dayOfMonth
        }));
      }
      else {
        alertFaultUpdate();
      }
    };
    await updateSendCpaReportApi(callApi, callBack, { dayInMonth: dayOfMonth });
  };

  const onClickUpdateCpaAccountCode = async (accountCode, cpaAccountCode) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        const updatedFinanceAccounts = financeState?.accounts.map(account => {
          if (account.accountCode === accountCode) {
            return {
              ...account,
              cpaAccountCode: cpaAccountCode
            };
          }
          return account;
        });
        setAccountList(updatedFinanceAccounts);
        setPureAccountList(updatedFinanceAccounts);
        setFinanceState(prevState => ({
          ...prevState,
          accounts: updatedFinanceAccounts
        }));
      }
      else {
        alertFaultUpdate();
      }
    };
    await updateCpaAccountCodeApi(callApi, callBack, {
      accountCode: accountCode,
      cpaAccountCode: cpaAccountCode
    });
  };

  useEffect(() => {
    getAccountsFromFinance();
  }, [])

  return {
    accountName,
    accountEmail,
    dayOfMonth,
    onChangeAccountName,
    onResetAccountName,
    onClickUpdateCpaMangerName,
    onChangeAccountEmail,
    onResetAccountMail,
    onClickUpdateCpaMangerMail,
    onChangeSelectDayOfMonth,
    getAccountRows,
    onResetDayOfMonth,
    onClickUpdateDayInMonth

  };
};

export { useFinances };