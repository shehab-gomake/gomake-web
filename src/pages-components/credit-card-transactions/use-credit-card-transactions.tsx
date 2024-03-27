import {  useRef, useState } from "react";
import { useAgentsList, useCustomerDropDownList } from "@/hooks";


const useCreditCardTransactions = () => {
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();
  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onClickClearFilter = () => {
        console.log("onClickSearchFilter");
  };
  const onClickSearchFilter = ()=>{
    console.log("onClickSearchFilter");
  };



  return {
    onSelectDeliveryTimeDates,
    resetDatePicker,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickClearFilter,
    onClickSearchFilter,
    
  };
};

export { useCreditCardTransactions };
