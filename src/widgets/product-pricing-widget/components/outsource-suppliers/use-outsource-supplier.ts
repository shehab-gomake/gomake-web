import {useRecoilState, useRecoilValue} from "recoil";
import {
    currentProductItemValueDraftId,
    currentProductItemValuePriceState,
    currentProductItemValueState,
    outsourceSuppliersState,
} from "@/widgets/product-pricing-widget/state";
import {useGomakeAxios, useGomakeRouter, useSnackBar} from "@/hooks";
import {currentCalculationConnectionId, productItemValueByEditState, } from "@/store";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";
import {addItemApi, updateDocumentItemApi} from "@/services/api-service/generic-doc/documents-api";
import { updateProductItemValueOutsourceSupplierCost } from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { EOutSoucrceUpdateKey } from "@/enums";
import { useRouter } from "next/router";

const useOutsourceSupplier = () => {
    const router = useRouter();
    const [suppliers, setSuppliers] = useRecoilState(outsourceSuppliersState);
    const productItemValueByEdit = useRecoilValue<any>(productItemValueByEditState);
    const currentProductItemValue = useRecoilValue<any>(currentProductItemValueState);
    const productItemValueDraftId = useRecoilValue<string>(currentProductItemValueDraftId);
    const connectionId = useRecoilValue(currentCalculationConnectionId);
    const { navigate } = useGomakeRouter();
    const { callApi } = useGomakeAxios();
    const { alertFaultAdded, alertFaultUpdate } = useSnackBar();

    const resetOtherSuppliers = (supplierId) => {
        return suppliers.map(supplier => {
            if (supplier.supplierId !== supplierId) {
                return {
                    ...supplier,
                    cost: 0,
                    finalPrice: 0,
                    profit: 0,
                    workHours: 0
                };
            }
            return supplier;
        });
    };

    const updateProductItemValueOutsourceWithKey = async (supplierId, key, value) => {
        await updateProductItemValueOutsourceSupplierCost(callApi, () => { }, {
            productItemValueId: productItemValueDraftId,
            signalRConnectionId: connectionId,
            supplierId,
            key,
            value
        });
    };

    const updateCost = (supplierId, cost) => {
        const updatedSuppliers = suppliers.map(supplier => {
            if (supplier.supplierId === supplierId) {
                return {
                    ...supplier,
                    cost: cost,
                    finalPrice: cost + cost * supplier.profit / 100
                };
            }
            return supplier;
        });

        setSuppliers(resetOtherSuppliers(supplierId).map(supplier => {
            if (supplier.supplierId === supplierId) {
                return updatedSuppliers.find(s => s.supplierId === supplierId);
            }
            return supplier;
        }));

        updateProductItemValueOutsourceWithKey(supplierId, EOutSoucrceUpdateKey.TotalCost, cost);
    };

    const updateWorkHours = (supplierId, workHours) => {
        const updatedSuppliers = suppliers.map(supplier => {
            if (supplier.supplierId === supplierId) {
                return {
                    ...supplier,
                    workHours: workHours
                };
            }
            return supplier;
        });

        setSuppliers(resetOtherSuppliers(supplierId).map(supplier => {
            if (supplier.supplierId === supplierId) {
                return updatedSuppliers.find(s => s.supplierId === supplierId);
            }
            return supplier;
        }));

        updateProductItemValueOutsourceWithKey(supplierId, EOutSoucrceUpdateKey.TotalRealProductionTime, workHours);
    };

    const updateProfit = (supplierId, profit) => {
        const updatedSuppliers = suppliers.map(supplier => {
            if (supplier.supplierId === supplierId) {
                return {
                    ...supplier,
                    profit: profit,
                    finalPrice: supplier.cost + supplier.cost * profit / 100
                    
                };
                
            }
            return supplier;
        });

        setSuppliers(resetOtherSuppliers(supplierId).map(supplier => {
            if (supplier.supplierId === supplierId) {
                return updatedSuppliers.find(s => s.supplierId === supplierId);
            }
            return supplier;
        }));

        updateProductItemValueOutsourceWithKey(supplierId, EOutSoucrceUpdateKey.Profit, profit);
    };
    

    const updatePrice = (supplierId, price) => {
        const updatedSuppliers = suppliers.map(supplier => {
            if (supplier.supplierId === supplierId) {
                return {
                    ...supplier,
                    finalPrice: price,
                    profit: (price - supplier.cost) / supplier.cost * 100
                };
            }
            return supplier;
        });

        setSuppliers(resetOtherSuppliers(supplierId).map(supplier => {
            if (supplier.supplierId === supplierId) {
                return updatedSuppliers.find(s => s.supplierId === supplierId);
            }
            return supplier;
        }));

        updateProductItemValueOutsourceWithKey(supplierId, EOutSoucrceUpdateKey.TotalPrice, price);
    };

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
                    unitPrice: supplier.finalPrice / parseFloat(currentProductItemValue.amount)
                },
                documentType: 0,
            });
        }
    };

    const addItemCallBack = (res) => {
        if (res.success) {
            navigate("/quote");
        } else {
            alertFaultAdded();
        }
    };

    const updateQuoteItem = async (supplierId) => {
        const supplier = suppliers.find(s => s.supplierId === supplierId);
        if (supplier) {
            const callBack = (res) => {
                if (res?.success) {
                    navigate("/quote");
                } else {
                    alertFaultUpdate();
                }
            };
            await updateDocumentItemApi(callApi, callBack, {
                Item: {
                    ...currentProductItemValue,
                    signalRConnectionId: connectionId,
                    itemId: router?.query?.documentItemId,
                    sourceType: EWorkSource.OUT,
                    outSoucreCost: supplier.cost,
                    outSoucreProfit: supplier.profit,
                    outSourceFinalPrice: supplier.finalPrice,
                    supplierId: supplierId,
                    unitPrice: supplier.finalPrice / parseFloat(currentProductItemValue.amount)
                },
                DocumentType: Number(router?.query?.documentType),
            });
        }
    };

    return {
        updateCost,
        updateWorkHours,
        updateProfit,
        updatePrice,
        addItem,
        updateQuoteItem
    };
};

export { useOutsourceSupplier };
