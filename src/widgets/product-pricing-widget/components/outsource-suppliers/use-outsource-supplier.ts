import {useRecoilState, useRecoilValue} from "recoil";
import {
    currentProductItemValueState,
    itemParametersValuesState,
    outsourceSuppliersState,
    productUrgentWorkState
} from "@/widgets/product-pricing-widget/state";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";
import {useRouter} from "next/router";
import {addItemToQuoteApi} from "@/services/api-service/quotes/qoutes-endpoints";
import {userProfileState} from "@/store/user-profile";
import {quantityParameterState} from "@/store";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {addItemApi} from "@/services/api-service/generic-doc/documents-api";

const useOutsourceSupplier = () => {
    const [suppliers, setSuppliers] = useRecoilState(outsourceSuppliersState);
    const parameters = useRecoilValue(itemParametersValuesState);
    const userProfile = useRecoilValue(userProfileState);
    const isUrgent = useRecoilValue(productUrgentWorkState);
    const quantity = useRecoilValue(quantityParameterState);
    const currentProductItemValue =
        useRecoilValue<any>(currentProductItemValueState);
    const {navigate} = useGomakeRouter();
    const {callApi} = useGomakeAxios();
    const router = useRouter();
    const updateCost = (supplerId: string, cost: number) => {
        setSuppliers(suppliers?.map(suppler => {
            if (suppler.supplierId === supplerId) {
                return {
                    ...suppler,
                    cost: cost,
                    finalPrice: cost + cost * suppler.profit / 100
                }
            }
            return suppler
        }));
    }
    const updateWorHours = (supplerId: string, workHours: number) => {
        setSuppliers(suppliers?.map(suppler => {
            if (suppler.supplierId === supplerId) {
                return {
                    ...suppler,
                    workHours: workHours
                }
            } else {
                return suppler
            }
        }));
    }

    const updateProfit = (supplerId: string, profit: number) => {
        setSuppliers(suppliers?.map(suppler => {
            if (suppler.supplierId === supplerId) {
                return {
                    ...suppler,
                    profit: profit,
                    finalPrice: suppler.cost + suppler.cost * profit / 100
                }
            } else {
                return suppler
            }
        }));
    }

    const updatePrice = (supplerId: string, price: number) => {
        setSuppliers(suppliers?.map(suppler => {
            if (suppler.supplierId === supplerId) {
                return {
                    ...suppler,
                    finalPrice: price,
                    profit: (price - suppler.cost) / suppler.cost * 100
                }
            } else {
                return suppler
            }
        }));
    }

    const addItem = async (supplierId) => {
        const supplier = suppliers.find(s => s.supplierId === supplierId);
        if (supplier) {
            await addItemApi(callApi, addItemCallBack, {
                item: {
                    ...currentProductItemValue,
                    sourceType: EWorkSource.OUT,
                    outSoucreCost: supplier.cost,
                    outSoucreProfit: supplier.profit,
                    outSourceFinalPrice: supplier.finalPrice,
                    supplierId: supplierId,
                    unitPrice:supplier.finalPrice/parseFloat(currentProductItemValue.amount)
                },
                documentType: 0,
            });
        }
        }
        const addItemCallBack = (res) => {
            if (res.success) {
                navigate("/quote");
            }
        }

        return {
            updateCost,
            updateWorHours,
            updateProfit,
            updatePrice,
            addItem
        }
    }
    export {useOutsourceSupplier}

