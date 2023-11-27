import {useGomakeAxios, useSnackBar} from "@/hooks";
import {getPrintHouseSuppliersListApi} from "@/services/api-service/suppliers/suppliers-endpoints";
import {useState} from "react";
import {addMaterialSupplier} from "@/services/api-service/materials/materials-suppliers-endpoints";
import {useRouter} from "next/router";
import {useRecoilState, useSetRecoilState } from "recoil";
import {
    activeFilterState,
    flagState,
    materialCategorySuppliersState,
    openAddSupplierModalState,
    selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "../../enums";
import { Alert } from "react-bootstrap";

const useAddMaterialSupplier = () => {
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {materialType, materialCategory} = query;
    const [suppliers, setSuppliers] = useState<{ label: string, value: string }[]>([])
    const [newSupplier, setNewSupplier] = useState<{ label: string, value: string, isDefault: boolean } | null>(null);
    const {alertSuccessAdded, alertFaultAdded} = useSnackBar();
    const [openModal, setOpenModal] = useRecoilState(openAddSupplierModalState);
    const setSelectedSupplier = useSetRecoilState(selectedSupplierIdState);
    const [materialSuppliers, setMaterialSuppliers] = useRecoilState(materialCategorySuppliersState);
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setFlagState = useSetRecoilState(flagState);


    const getPrintHouseSuppliersList = async () => {
        const callBack = (res) => {
            if (res.success) {
                setSuppliers(res.data.map((supplier: { id: string, name: string }) => ({
                    label: supplier.name,
                    value: supplier.id
                })));
            }
        }
        await getPrintHouseSuppliersListApi(callApi, callBack)
    }

    const onSelectSupplier = (e, value) => {
        setNewSupplier(value);
    }

    const onAddSupplier = async (materialCategories) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
                setOpenModal(false)
                setMaterialSuppliers([...materialSuppliers, newSupplier])
                setSelectedSupplier(newSupplier.value);
                setActiveFilter(EMaterialActiveFilter.ALL);
                materialCategories.find(category => category.categoryKey === materialCategory)?.isAddedByPrintHouse ? setFlagState(true) : setFlagState(false)
            } else {
                alertFaultAdded();
            }
        }
        if (newSupplier) {
            await addMaterialSupplier(callApi, callBack, {
                materialTypeKey: materialType.toString(),
                categoryKey: materialCategory.toString(),
                supplierId: newSupplier.value
            })
        }
    }
    return {
        getPrintHouseSuppliersList,
        suppliers,
        onSelectSupplier,
        onAddSupplier,
        openModal,
        setOpenModal
    }
}

export {useAddMaterialSupplier}