import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { materialCategoryDataState, materialsClientsState, materialsMachinesState } from "@/widgets/materials-widget/state";
import { updatePrintHouseMaterialPropApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { updateMaterialPropApi } from "@/services/api-service/materials/materials-endpoints";
import { useCallback } from "react";
import { getAndSetAllCustomers } from "@/services/hooks";

const useTableCellData = (isAdmin: boolean) => {
    const { callApi } = useGomakeAxios();
    const [data, setData] = useRecoilState(materialCategoryDataState);

    const updateCellData = async (id: string, key: string, value: string | boolean, index?: number) => {
        const callBack = (res) => {
            if (res.success) {
                setData(data.map(row => row.id === id ? { ...row, ...res.data } : row));
            }
        }
        if (isAdmin) {
            await updateMaterialPropApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        } else {
            await updatePrintHouseMaterialPropApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        }

    }

    const machinesCategories = useRecoilValue<any>(materialsMachinesState);
    const machinesOptions = machinesCategories.map((machine) => ({
        value: machine.id,
        label: `${machine.manufacturer} - ${machine.model}`,
    }));

    const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
        await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
            ClientType: "C",
            onlyCreateOrderClients: false,
            searchTerm: SearchTerm,
        });
    }, []);

    const [customersListCreateQuote, setCustomersListCreateQuote] = useRecoilState<any>(materialsClientsState);
    const clientsOptions = customersListCreateQuote.map((client) => ({
        value: client.id,
        label: `${client.name} - ${client.code}`,
    }));

    const checkWhatRenderArray = (e) => {
        if (e.target.value) {
            getAllCustomersCreateQuote(e.target.value);
        }
    };

    const renderClientsOptions = () => {
        return clientsOptions;
    };

    return {
        updateCellData,
        machinesOptions,
        clientsOptions,
        renderClientsOptions,
        checkWhatRenderArray
    }
}

export { useTableCellData }