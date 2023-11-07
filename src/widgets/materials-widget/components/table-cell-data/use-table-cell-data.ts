import {useGomakeAxios} from "@/hooks";
import {updateMaterialPropApi} from "@/services/api-service/materials/materials-endpoints";
import {useRecoilState} from "recoil";
import {materialCategoryDataState} from "@/widgets/materials-widget/state";

const useTableCellData = () => {
    const {callApi} = useGomakeAxios();
    const [data, setData] = useRecoilState(materialCategoryDataState);

    const updateCellData = async (id: string, key: string, value: string | boolean, index?:number) => {
        const callBack = (res) => {
            if (res.success) {
                setData(data.map(row => row.id === id ? {...row, ...res.data} : row));
            }
        }
        await updateMaterialPropApi(callApi, callBack, {
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