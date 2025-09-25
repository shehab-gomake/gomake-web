import { useGomakeAxios} from "@/hooks";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {materialCategoryDataState, materialsClientsState, materialsMachinesState, selectedSupplierIdState, openChildTableState, inventoryDataState, purchasePricingDataState, activeFilterState, materialsTablePageState} from "@/widgets/materials-widget/state";
import {updatePrintHouseMaterialPropApi, updateSupplierInventoryApi, getSupplierInventoriesApi, getPurchasePricingApi, updatePrintHouseMaterialRowApi, getPrintHouseMaterialCategoryDataNewApi} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {updateMaterialPropApi, getMaterialCategoryDataApi} from "@/services/api-service/materials/materials-endpoints";
import { useMaterialsCategories } from "../../use-materials-categories";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { updateProfitProfileProductMaterialApi } from "@/services/api-service/products/product-endpoints";
import { openPriceModalState } from "@/store";

const useTableCellData = (isAdmin:boolean, inventoryTable: boolean = false, purchasePricingTable: boolean = false) => {
    const {callApi} = useGomakeAxios();
    const [data, setData] = useRecoilState(materialCategoryDataState);
    const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
    const openChildTable = useRecoilValue(openChildTableState);
    const setInventoryData = useSetRecoilState(inventoryDataState);
    const setPurchasePricingData = useSetRecoilState(purchasePricingDataState);
    const activeFilter = useRecoilValue(activeFilterState);
    const pageNumber = useRecoilValue(materialsTablePageState);
    const [openPriceModal, setOpenPriceModal] = useRecoilState<boolean>(openPriceModalState);
    const onClickClosePriceModal = () => {
      setOpenPriceModal(false);
    };
    const onClickOpenPriceModal = () => {
      setOpenPriceModal(true);
    };
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const supplierId = useRecoilValue(selectedSupplierIdState);
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);
    const machinesOptions = machinesCategories.map((machine) => ({
      value: machine.id,
      label: machine.nickName
    }));
  
    const [clientsCategories, setClientsCategories] = useRecoilState<any>(materialsClientsState);

 
    const clientsOptions = clientsCategories.map((client) => ({
        value: client.id,
        label: `${client.name} - ${client.code}`,
      }));
    
    // Function to refresh inventory data after update
    const refreshInventoryData = async (printHouseMaterialId: string) => {
        const callBack = (res) => {
            if (res.success) {
                setInventoryData(res.data);
            }
        };
        await getSupplierInventoriesApi(callApi, callBack, printHouseMaterialId);
    };

    // Function to refresh purchase pricing data after update
    const refreshPurchasePricingData = async (printHouseMaterialId: string) => {
        const callBack = (res) => {
            if (res.success) {
                setPurchasePricingData(res.data);
            }
        };
        await getPurchasePricingApi(callApi, callBack, printHouseMaterialId);
    };

    // Function to refresh main table data without showing loading spinner
    const refreshMainTableData = async () => {
        const callBack = (res) => {
            if (res.success) {
                const processedData = res.data?.result?.data?.map((row) => {
                    const newRow = { ...row, checked: false };
                    
                    // Handle SKU from API response (top level)
                    if (row.sku !== null && row.sku !== undefined && row.sku !== "") {
                        newRow.rowData.sku = {
                            value: row.sku,
                            isEditable: true,
                            type: 1 // NUMBER
                        };
                    }

                    // Handle isActive from API response (top level)
                    if (row.isActive !== null && row.isActive !== undefined) {
                        newRow.rowData.Active = {
                            value: row.isActive,
                            isEditable: true,
                            type: 2 // BOOLEAN
                        };
                    }

                  
                    return newRow;
                });
                
                setData(processedData);
            }
        };
        
        const requestData = {
            materialKey: materialType?.toString(),
            categoryKey: materialCategory?.toString(),
            supplierId: supplierId,
            isActive: true, // Default to active for refresh
            customFiltersKeyValueList: []
        };

        if (isAdmin) {
            await getMaterialCategoryDataApi(callApi, callBack, requestData, false, new AbortController());
        } else {
            await getPrintHouseMaterialCategoryDataNewApi(callApi, callBack, requestData, false, new AbortController());
        }
    };

    const updateCellData = async (id: string, key: string, value: string | boolean, index?:number, pricingType?: number) => {
        
        const callBack = (res) => {
            if (res.success) {
                if (inventoryTable) {
                    // Refresh inventory data after successful update
                    refreshInventoryData(openChildTable.rowId);
                } else if (purchasePricingTable) {
                    // Refresh purchase pricing data after successful update
                    refreshPurchasePricingData(openChildTable.rowId);
                } else {
                    // Refresh main table data without loading spinner
                    refreshMainTableData();
                }
                if(key.includes("price")){
                    onClickOpenPriceModal()
                }
            }
        }
        
        if(inventoryTable){
            // Use inventory API with correct payload structure
            await updateSupplierInventoryApi(callApi, callBack, {
                id: id,
                key: key,
                priceIndex: index ,
                updatedValue: value.toString(),
                pricingType: pricingType 
            })
        } else if(purchasePricingTable){
            // Use same API for purchase pricing (will change when BE is ready)
            await updatePrintHouseMaterialPropApi(callApi, callBack, {
                id: id,
                key: key,
                priceIndex: index ,
                updatedValue: value.toString(),
            })
        } else if(isAdmin){
            await updateMaterialPropApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        }else{
            await updatePrintHouseMaterialRowApi(callApi, callBack, {
                key: key,
                id,
                updatedValue: value,
                priceIndex: index,
            })
        }
        
    }

    const updateProfitProfileProductHidden = useCallback(async (isUpdateAndFixPrice:boolean) => {
        const callBack = (res) => {
          if (res?.success) {
            onClickClosePriceModal()
          }
         
        }
        await updateProfitProfileProductMaterialApi(callApi, callBack, {
            key: materialCategory?.toString(),
            isUpdateAndFixPrice: isUpdateAndFixPrice,
        });
      }, [materialCategory])
    return {
        updateCellData,
        machinesOptions,
        clientsOptions,
        openPriceModal,
        onClickClosePriceModal,
        updateProfitProfileProductHidden,
    }
}

export {useTableCellData}