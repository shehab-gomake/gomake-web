import { useGomakeAxios } from "./use-gomake-axios";
import { useRecoilState } from "recoil";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { getAndSetClientTypes } from "@/services/api-service/customers/clientTypes-api";

const useClientTypesList = () => {
    const { callApi } = useGomakeAxios();
    const [clientTypesCategories, setClientTypesCategories] = useRecoilState(clientTypesCategoriesState);

    const getClientTypesCategories = async () => {
        const callBack = (res) => {
            if (res.success) {
                const clientTypes = res.data.map((types) => ({
                    label: types.name,
                    id: types.id,
                    additionProfits : types?.additionProfits  ?? 0,  

                }));
                setClientTypesCategories(clientTypes);
            }
        };
        await getAndSetClientTypes(callApi, callBack, { cardType: CLIENT_TYPE_Id.CUSTOMER });
    };


    return {
        clientTypesCategories,
        setClientTypesCategories,
        getClientTypesCategories
    };
};

export { useClientTypesList };
