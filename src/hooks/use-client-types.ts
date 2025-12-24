import { useGomakeAxios } from "./use-gomake-axios";
import { useRecoilState } from "recoil";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetClientTypes } from "@/services/api-service/customers/clientTypes-api";
import { useEffect } from "react";

const useClientTypesList = (
  autoFetch: boolean = false,
  cardTypeId: CLIENT_TYPE_Id = CLIENT_TYPE_Id.CUSTOMER
) => {
  const { callApi } = useGomakeAxios();
  const [clientTypesCategories, setClientTypesCategories] = useRecoilState(
    clientTypesCategoriesState
  );

  const getClientTypesCategories = async (
    typeId: CLIENT_TYPE_Id = cardTypeId
  ) => {
    const callBack = (res) => {
      if (res.success) {
        const clientTypes = res.data.map((types) => ({
          label: types.name,
          id: types.id,
          additionProfits: types?.additionProfits ?? 0,
          discount: types?.discount ?? 0,
          excludeOutsourceJobs: types?.excludeOutsourceJobs ?? false,
        }));
        setClientTypesCategories(clientTypes);
      }
    };
    await getAndSetClientTypes(callApi, callBack, {
      cardType: typeId,
    });
  };

  useEffect(() => {
    if (autoFetch) {
      getClientTypesCategories();
    }
  }, [autoFetch]);

  return {
    clientTypesCategories,
    setClientTypesCategories,
    getClientTypesCategories,
  };
};

export { useClientTypesList };
