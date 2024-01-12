import {useGomakeAxios} from "@/hooks";
import {useRecoilState} from "recoil";
import {materialCategoryDataState} from "@/widgets/materials-widget/state";
import {updatePrintHouseMaterialPropApi} from "@/services/api-service/materials/printhouse-materials-endpoints";

const useTableCellData = () => {
    const {callApi} = useGomakeAxios();
    const [data, setData] = useRecoilState(materialCategoryDataState);

    const updateCellData = async (id: string, key: string, value: string | boolean, index?:number) => {
        const callBack = (res) => {
            if (res.success) {
                setData(data.map(row => row.id === id ? {...row, ...res.data} : row));
            }
        }
        await updatePrintHouseMaterialPropApi(callApi, callBack, {
            key: key,
            id,
            updatedValue: value,
            priceIndex: index,
        })
    }

    return {
        updateCellData
    }
}

export {useTableCellData}