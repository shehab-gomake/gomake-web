import { useState } from "react";

const useFinances = () => {
  const [accountName,setAccountName]=useState<string>("")
  const [accountEmail,setAccountEmail]=useState<string>("")
  const [dayOfMonth,setDayOfMonth]=useState<number>(1)

  const onChangeAccountName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(event.target.value);
  }
  const onChangeAccountEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountEmail(event.target.value);
  }
  const onChangeSelectDayOfMonth = (event: React.ChangeEvent<HTMLInputElement>,value:any) => {
    setDayOfMonth(Number(value));
  }
  return {
    accountName,
    accountEmail,
    dayOfMonth,
    onChangeAccountName,
    onChangeAccountEmail,
    onChangeSelectDayOfMonth
  };
};

export { useFinances };
