import {useRecoilState, useRecoilValue} from "recoil";
import {
    IMaterialItem,
    materialsListState,
    selectedMaterialsListState
} from "@/widgets/quick-setup-widgets/materials/state";
import {useEffect} from "react";
import {quickSetupGetMaterials, quickSetupSaveMaterialCategories} from "@/services/api-service/materials/quick-setup-materials-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";

const useQuickSetupMaterials = () => {
    const [materials, setMaterials] = useRecoilState(materialsListState);
    const selectedMaterials = useRecoilValue(selectedMaterialsListState);
    const {callApi} = useGomakeAxios();
    const {push} = useRouter();
    const {alertFaultAdded} = useSnackBar();
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
    const saveSelectedMaterials = async () => {
        const callBack = (res) => {
            if (res.success) {
                push('/quick-setup/materials/pricing').then();
            } else {
                alertFaultAdded();
            }
        }
        await quickSetupSaveMaterialCategories(callApi,callBack,selectedMaterials)
    }
    useEffect(() => {
        getAllMaterials().then();
    }, []);

    return {
        selectedMaterials,
        onRemoveMaterial,
        saveSelectedMaterials
    }
}
export {useQuickSetupMaterials}