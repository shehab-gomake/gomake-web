import { useGomakeAxios, useSnackBar} from "@/hooks";
import {useRecoilState, useRecoilValue} from "recoil";
import { materialsClientsState, materialsMachinesState, materialCategoryDataState, openChildTableState, inventoryDataState, purchasePricingDataState} from "@/widgets/materials-widget/state";
import {updateSupplierInventoryApi, updatePrintHouseMaterialRowApi, updatePrintHouseMaterialSupplierApi} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {updateMaterialPropApi} from "@/services/api-service/materials/materials-endpoints";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { updateProfitProfileProductMaterialApi } from "@/services/api-service/products/product-endpoints";
import { openPriceModalState } from "@/store";
import { filterNullFromArrays } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

const useTableCellData = (isAdmin:boolean, inventoryTable: boolean = false, purchasePricingTable: boolean = false) => {
    const {callApi} = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate, alertFault } = useSnackBar();
    const [openPriceModal, setOpenPriceModal] = useRecoilState<boolean>(openPriceModalState);
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState(materialCategoryDataState);
    const [inventoryData, setInventoryData] = useRecoilState(inventoryDataState);
    const [purchasePricingData, setPurchasePricingData] = useRecoilState(purchasePricingDataState);
    const openChildTable = useRecoilValue(openChildTableState);
    const onClickClosePriceModal = () => {
      setOpenPriceModal(false);
    };
    const onClickOpenPriceModal = () => {
      setOpenPriceModal(true);
    };
    const { query } = useRouter();
    const {  materialCategory } = query;
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

    // Function to update Total Inventory in parent table
    const updateTotalInventoryInParent = (materialId: string, newTotalInventory: number) => {
        setMaterialCategoryData(prevData =>
            prevData.map(row => {
                if (row.id === materialId) {
                    // Create a new row object with updated inventory data
                    const updatedRow = { ...row };
                    // Common field names could be 'inventory', 'totalInventory', 'stock', etc.
                    const inventoryFields = ['totalInventory'];

                    for (const field of inventoryFields) {
                        if (updatedRow.rowData[field] !== undefined) {
                            updatedRow.rowData = {
                                ...updatedRow.rowData,
                                [field]: {
                                    ...updatedRow.rowData[field],
                                    value: newTotalInventory.toString()
                                }
                            };
                            break;
                        }
                    }

                    return updatedRow;
                }
                return row;
            })
        );
    };

    // Function to update main table data with backend response
    const updateMainTableData = (materialId: string, updatedRowData: any) => {
        setMaterialCategoryData(prevData =>
            prevData.map(row => {
                if (row.id === materialId) {
                    // Update the row with the new data from backend
                    return {
                        ...row,
                        ...updatedRowData,
                        rowData: {
                            ...row.rowData,
                            ...updatedRowData.rowData
                        }
                    };
                }
                return row;
            })
        );
    };

    // Function to update inventory table data with backend response
    const updateInventoryTableData = (rowId: string, updatedRowData: any) => {
        setInventoryData(prevData =>
            prevData.map(row => {
                if (row.id === rowId) {
                    // Update the inventory row with the new data from backend
                    return {
                        ...row,
                        ...updatedRowData
                    };
                }
                return row;
            })
        );
    };

    // Function to update purchase pricing table data with backend response
    const updatePurchasePricingTableData = (rowId: string, updatedRowData: any) => {
        setPurchasePricingData(prevData =>
            prevData.map(row => {
                if (row.id === rowId) {
                    // Update the inventory row with the new data from backend
                    return {
                        ...row,
                        ...updatedRowData
                    };
                }
                return row;
            })
        );
    };
    const { t } = useTranslation()

    const updateCellData = async (id: string, key: string, value: string | boolean, index?:number, pricingType?: number,UpdateRelatedFields?:boolean) => {
        return new Promise((resolve, reject) => {
            const callBack = (res) => {
                const error = res?.errors;
                let userMessage = t("materials.inputs.duplicateFailedTryAgain");
                if (res.success) {
                    // Handle inventory table updates
                    if (inventoryTable && res.data) {
                        // Update the specific inventory row with new data
                        if (res.data.row) {
                            updateInventoryTableData(id, res.data.row);
                        }
                        
                        // Update Total Inventory in parent table
                        if ( typeof res.data.totalInventory === 'number') {
                            updateTotalInventoryInParent(openChildTable.rowId, res.data.totalInventory);
                        }
                    }
                    
                    // Update main table data with backend response for non-inventory tables
                    if (!inventoryTable && !purchasePricingTable && res.data) {
                        updateMainTableData(id, res.data);
                    }
                    if(purchasePricingTable && res.data){
                        updatePurchasePricingTableData(id, res.data);
                    }
                    
                    if(key.includes("price")){
                        onClickOpenPriceModal()
                    }
                    alertSuccessUpdate();
                    resolve(res); // Resolve with success response
                } 
                else {
                    if (res?.statusCode === 2627) {
              
                        if (error?.errorParams?.length > 0) {
                          const duplicateFields = error?.errorParams
                            ?.map(p => p.key)
                            ?.filter(Boolean)
                            ?.join(", ");
                          userMessage = t("materials.inputs.duplicateDuplicateFields", { fields: duplicateFields });
                        }
                        else if (error?.ErrorMessage) {
                          userMessage = error.ErrorMessage;
                        }
                        alertFault(userMessage);
                        // Resolve with error info instead of rejecting to prevent unhandled errors
                        resolve({ success: false, error: userMessage, statusCode: 2627 });
                      }
                      else {
                        alertFaultUpdate();
                        resolve({ success: false, error: res }); // Resolve with error response
                      }
                    
                   
                }
            };
        
            if(inventoryTable){
                // Use inventory API with correct payload structure
                updateSupplierInventoryApi(callApi, callBack, {
                    id: id,
                    key: key,
                    priceIndex: index ,
                    updatedValue: filterNullFromArrays(value) ,
                    pricingType: pricingType 
                });
            } 
            else if(purchasePricingTable){
                // Use same API for purchase pricing (will change when BE is ready)
                updatePrintHouseMaterialSupplierApi(callApi, callBack, {
                    id: id,
                    key: key,
                    priceIndex: index ,
                    updatedValue: filterNullFromArrays(value),
                });
            } else if(isAdmin){
                updateMaterialPropApi(callApi, callBack, {
                    key: key,
                    id,
                    updatedValue: filterNullFromArrays(value),
                    priceIndex: index,
                });
            }else{
                updatePrintHouseMaterialRowApi(callApi, callBack, {
                    key: key,
                    id,
                    updatedValue:  filterNullFromArrays(value),
                    priceIndex: index,
                    updateRelatedFields: UpdateRelatedFields,
                });
            }
        });
        
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
        updateInventoryTableData,
        updateMainTableData,
        updatePurchasePricingTableData,
    }
}

export {useTableCellData}