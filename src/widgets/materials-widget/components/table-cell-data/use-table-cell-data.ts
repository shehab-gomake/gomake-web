import {useGomakeAxios} from "@/hooks";
import {useRecoilState, useRecoilValue} from "recoil";
import {materialCategoryDataState, materialsClientsState, materialsMachinesState, selectedSupplierIdState} from "@/widgets/materials-widget/state";
import {updatePrintHouseMaterialPropApi} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {updateMaterialPropApi} from "@/services/api-service/materials/materials-endpoints";
import { useMaterialsCategories } from "../../use-materials-categories";
import { useRouter } from "next/router";

const useTableCellData = (isAdmin:boolean) => {
    const {callApi} = useGomakeAxios();
    const [data, setData] = useRecoilState(materialCategoryDataState);
    const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const supplierId = useRecoilValue(selectedSupplierIdState);
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);
    const machinesOptions = machinesCategories.map((machine) => ({
      value: machine.id,
      label: `${machine.manufacturer} - ${machine.model}`,
    }));
  
    const clientsCategories = useRecoilValue<any>(materialsClientsState);
    const clientsOptions = clientsCategories.map((client) => ({
        value: client.id,
        label: `${client.name} - ${client.code}`,
      }));
    
    const updateCellData = async (id: string, key: string, value: string | boolean, index?:number) => {
        const callBack = (res) => {
            if (res.success) {
                setData(data.map(row => row.id === id ? {...row, ...res.data} : row));
                if(materialType ==="devices"){
                    getMaterialCategoryData(
                        materialType?.toString(),
                        materialCategory?.toString(),
                        [],
                        supplierId
                    )
                }
              
            }
        }
        if(isAdmin){
            await updateMaterialPropApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        }else{
            await updatePrintHouseMaterialPropApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        }
        
    }

    return {
        updateCellData,
        machinesOptions,
        clientsOptions
    }
}

export {useTableCellData}