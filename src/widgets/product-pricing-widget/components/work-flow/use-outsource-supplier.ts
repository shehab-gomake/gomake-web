import {useRecoilState} from "recoil";
import {outsourceSuppliersState} from "@/widgets/product-pricing-widget/state";

const useOutsourceSupplier = () => {
    const [suppliers, setSuppliers] = useRecoilState(outsourceSuppliersState);

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

    return {
        updateCost,
        updateWorHours,
        updateProfit,
        updatePrice
    }
}
export {useOutsourceSupplier}

