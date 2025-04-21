import { useGomakeAxios } from "./use-gomake-axios";
import { useRecoilState } from "recoil";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetClientTypes } from "@/services/api-service/customers/clientTypes-api";
import { useEffect } from "react";

interface UseClientTypesListProps {
  shouldRenderClientTypesOnMount?: boolean;
}

const useClientTypesList = ({
  shouldRenderClientTypesOnMount = false,
}: UseClientTypesListProps = {}) => {
  const { callApi } = useGomakeAxios();
  const [clientTypesCategories, setClientTypesCategories] = useRecoilState(
    clientTypesCategoriesState
  );

  const getClientTypesCategories = async (
    cardTypeId: CLIENT_TYPE_Id = CLIENT_TYPE_Id.CUSTOMER
  ) => {
    const callBack = (res) => {
      if (res.success) {
        const clientTypes = res.data.map((types) => ({
          label: types.name,
          id: types.id,
          additionProfits: types?.additionProfits ?? 0,
          discount: types?.discount ?? 0,
        }));
        setClientTypesCategories(clientTypes);
      }
    };
    await getAndSetClientTypes(callApi, callBack, {
      cardType: cardTypeId,
    });
  };

  useEffect(() => {
    if (shouldRenderClientTypesOnMount) {
      getClientTypesCategories();
    }
  }, [shouldRenderClientTypesOnMount]);

  return {
    clientTypesCategories,
    setClientTypesCategories,
    getClientTypesCategories,
  };
};

export { useClientTypesList };
