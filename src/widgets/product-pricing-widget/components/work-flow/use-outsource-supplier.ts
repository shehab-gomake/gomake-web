import {useRecoilState, useRecoilValue} from "recoil";
import {outsourceSuppliersState} from "@/widgets/product-pricing-widget/state";
import {useGomakeAxios, useGomakeRouter} from "@/hooks";
import {useRouter} from "next/router";
import {addItemToQuoteApi} from "@/services/api-service/quotes/qoutes-endpoints";
import {userProfileState} from "@/store/user-profile";

const useOutsourceSupplier = () => {
    const [suppliers, setSuppliers] = useRecoilState(outsourceSuppliersState);
    const userProfile = useRecoilValue(userProfileState);
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
            await addItemToQuoteApi(callApi, addItemCallBack, {
                productId: router?.query?.productId,
                outSoucreCost: supplier.cost,
                outSoucreProfit: supplier.profit,
                outSourceFinalPrice: supplier.finalPrice,
                supplierId: supplierId,
                userID: userProfile?.id,
                customerID: router?.query?.customerId,
                clientTypeId: router?.query?.clientTypeId,
                unitPrice: 300,
                amount: 50,
                isNeedGraphics: false,
                isUrgentWork: false,
                isNeedExample: false,
                //jobDetails: pricingDefaultValue?.jobDetails,
                itemParmetersValues: [],
                workFlow: [],
                actions: [],
            })
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

