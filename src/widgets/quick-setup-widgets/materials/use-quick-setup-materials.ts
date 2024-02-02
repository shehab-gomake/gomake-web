import {useRecoilState, useRecoilValue} from "recoil";
import {
    IMaterialItem,
    materialsListState,
    selectedMaterialsListState
} from "@/widgets/quick-setup-widgets/materials/state";
import {useEffect, useMemo} from "react";
import {quickSetupGetMaterials} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios} from "@/hooks";

const useQuickSetupMaterials = () => {
    const [materials, setMaterials] = useRecoilState(materialsListState);
    const selectedMaterials = useRecoilValue(selectedMaterialsListState);
    const {callApi} = useGomakeAxios();
    const onRemoveMaterial = (materialId: string) => {
        setMaterials(materials.map(material => material.id === materialId ? {...material, selected: false} : material ));
    };
    const getAllMaterials = async () => {
        const callBack = (res) => {
            if (res.success) {
                setMaterials(res?.data?.map((material, index): IMaterialItem => ({
                    ...material,
                    id: index.toString(),
                    selected: true
                })));
            }
        }
        await quickSetupGetMaterials(callApi, callBack);
    }

    useEffect(() => {
        getAllMaterials().then();
    }, []);

    return {
        selectedMaterials,
        onRemoveMaterial
    }
}
export {useQuickSetupMaterials}