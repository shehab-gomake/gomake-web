import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAndSetAllCustomers, getAndSetAllEmployees } from "@/services/hooks";
import { agentListsState, businessListsState, quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

const useBusinessNeWidget = ({ getQuote }) => {
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);
  useEffect(() => {
    const foundItem = customersListValue.find(
      (item: any) => item.id === quoteItemValue?.customerID
    );
    setSelectBusiness(foundItem);
  }, [quoteItemValue, customersListValue]);

  useEffect(() => {
    getAllCustomers();
  }, []);

  const [isUpdateBusinessName, setIsUpdateBusinessName] = useState<
    number | null
  >(null);
  const [isUpdatePurchaseNumer, setIsUpdatePurchaseNumer] = useState<
    number | null
  >(null);
  const [, setIsUpdateBusinessCode] = useState<number | null>(null);
  const [isUpdateAddress, setIsUpdateAddress] = useState<number | null>(null);
  const [isUpdateAgent, setIsUpdateAgent] = useState<number | null>(null);

  const onBlurBusinessName = async () => {
    setIsUpdateBusinessName(null);
  };
  const onBlurPurchaseNumer = async () => {
    setIsUpdatePurchaseNumer(null);
  };
  const onBlurBusinessCode = async () => {
    setIsUpdateBusinessCode(null);
  };
  const onBlurAddress = async () => {
    setIsUpdateAddress(null);
  };
  const onBlurAgent = async () => {
    setIsUpdateAgent(null);
  };

  const [selectedAgent, setSelectedAgent] = useState<any>();

  const [agentListValue, setAgentListValue] =
    useRecoilState<any>(agentListsState);
  const getAllEmployees = useCallback(async () => {
    await getAndSetAllEmployees(callApi, setAgentListValue, {
      isAgent: true,
    });
  }, []);
  useEffect(() => {
    if (agentListValue?.length > 0) {
      const selectedAgent1 = agentListValue.find(
        (agent) => agent.value === quoteItemValue?.agentId
      );
      setSelectedAgent(selectedAgent1);
    }
  }, [agentListValue, quoteItemValue]);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const updateAgent = useCallback(
    async (item: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/update-agent`,
        {
          quoteId: quoteItemValue?.id,
          agentId: item?.value,
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        setIsUpdateAgent(null);
        getQuote();
      } else {
        alertFaultUpdate();
      }
    },
    [quoteItemValue]
  );

  return {
    selectBusiness,
    isUpdateBusinessName,
    isUpdatePurchaseNumer,
    isUpdateAddress,
    selectedAgent,
    agentListValue,
    isUpdateAgent,
    setIsUpdateBusinessName,
    setIsUpdateAddress,
    setIsUpdatePurchaseNumer,
    setIsUpdateBusinessCode,
    onBlurBusinessName,
    onBlurPurchaseNumer,
    onBlurBusinessCode,
    onBlurAddress,
    onBlurAgent,
    setIsUpdateAgent,
    updateAgent,
    t,
  };
};

export { useBusinessNeWidget };
