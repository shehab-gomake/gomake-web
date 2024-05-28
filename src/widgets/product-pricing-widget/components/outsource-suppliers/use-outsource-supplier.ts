import {useRecoilState, useRecoilValue} from "recoil";
import {
    currentProductItemValueDraftId,
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
import { useEffect } from "react";

const useOutsourceSupplier = () => {
    const router=useRouter()
    const [suppliers, setSuppliers] = useRecoilState(outsourceSuppliersState);
    const productItemValueByEdit = useRecoilValue<any>(productItemValueByEditState)

    const currentProductItemValue =useRecoilValue<any>(currentProductItemValueState);
    const productItemValueDraftId = useRecoilValue<string>(currentProductItemValueDraftId);
    const updateSupplierInfo=()=>{
        const { supplierId, outSourceCost, outSourceProfits } = productItemValueByEdit;
        const updatedSuppliers = suppliers.map(supplier => {
          if (supplier.supplierId === supplierId) {
            return {
              ...supplier,
              cost: outSourceCost,
              finalPrice: outSourceCost + outSourceCost*outSourceProfits / 100,
              profit: outSourceProfits,
            };
          }
          return supplier;
        });
    
        setSuppliers(updatedSuppliers);
    }
    useEffect(() => {
        if(productItemValueByEdit?.sourceType){
            updateSupplierInfo()
        }
      }, [productItemValueByEdit]);
    const connectionId = useRecoilValue(currentCalculationConnectionId);
    const {navigate} = useGomakeRouter();
    const {callApi} = useGomakeAxios();
    const { alertFaultAdded,alertFaultUpdate } = useSnackBar();
    const updateProductItemValueOutsourceWithKey = async (supplierId:string, key: number, value:number) => {
        await updateProductItemValueOutsourceSupplierCost(callApi, () => { }, {
        productItemValueId: productItemValueDraftId,
        signalRConnectionId: connectionId,
        supplierId,
        key,
        value
        })
      }
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
        updateProductItemValueOutsourceWithKey(supplerId, EOutSoucrceUpdateKey.TotalCost, cost)
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
        updateProductItemValueOutsourceWithKey(supplerId, EOutSoucrceUpdateKey.TotalRealProductionTime, workHours)
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
        updateProductItemValueOutsourceWithKey(supplerId, EOutSoucrceUpdateKey.Profit, profit)
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
        updateProductItemValueOutsourceWithKey(supplerId, EOutSoucrceUpdateKey.TotalPrice, price)
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
            }else {
                alertFaultAdded();
              }
        }

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
                      unitPrice:supplier.finalPrice/parseFloat(currentProductItemValue.amount)
                    },
                    DocumentType: Number(router?.query?.documentType),
                  });
            }
           
          };
         

        return {
            updateCost,
            updateWorHours,
            updateProfit,
            updatePrice,
            addItem,
            updateQuoteItem
        }
    }
    export {useOutsourceSupplier}

