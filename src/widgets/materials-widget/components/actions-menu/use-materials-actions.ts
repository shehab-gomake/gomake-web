import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import {
    activeFilterState, filterState,
    isAllMaterialsCheckedState,
    materialCategoryDataState, materialsUnCheckedState,
    openAddRowModalState, selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import {useEffect, useRef, useState} from "react";
import { EMaterialActiveFilter,EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {updatePrintHouseMaterialsPropApi} from "@/services/api-service/materials/printhouse-materials-endpoints";

import {
    getMaterialExcelFileApi,
    updateMaterialsPropApi,
    uploadMaterialExcelFileApi
} from "@/services/api-service/materials/materials-endpoints";
import { useExchangeRate } from "@/hooks/use-exchange-rate";

const useMaterialsActions = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);
  const [action, setAction] = useState<{
    action: EMaterialsActions;
    key: string;
  } | null>(null);
  const [updatedValue, setUpdatedValue] = useState<string>("");
  const [currentCurrency, setCurrentCurrency] = useState<any>("");
  const [checkedPrice, setCheckedPrice] = useState(false);
  const { rate, setRate, getExchangeRate } = useExchangeRate();
  const isAllMaterialsChecked = useRecoilValue<boolean>(isAllMaterialsCheckedState);
  const uncheckedMaterials = useRecoilValue<string[]>(materialsUnCheckedState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const activeFilter = useRecoilValue(activeFilterState);
    const materialFilter = useRecoilValue(filterState);
    const elementRef = useRef(null);
  useEffect(() => {
    if (checkedPrice) getExchangeRate(currentCurrency, updatedValue);
  }, [checkedPrice, updatedValue, currentCurrency]);
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const setOpenAddRowModal = useSetRecoilState<boolean>(openAddRowModalState);
  const getSelectedMaterialsIds = () =>
    materialCategoryData.filter((row) => row.checked).map((row) => row.id);
  const onChooseAction = async (
    action: { action: EMaterialsActions; key: string } | null
  ) => {
      if(action.action === EMaterialsActions.AddNew){
          setOpenAddRowModal(true);
          return;
      }
      if(action.action === EMaterialsActions.DownLoadExcel){
          downloadExcelFile().then();
          return;
      }
      if(action.action === EMaterialsActions.UploadExcel){
          elementRef.current.click()
          return;
      }
    if (getSelectedMaterialsIds().length > 0) {
      const myId = getSelectedMaterialsIds()[0];
      const selectedRow = materialCategoryData.find((row) => row.id === myId);
      setCurrentCurrency(selectedRow?.rowData?.currency?.value);
    }
    if (action?.action === EMaterialsActions.AddNew) {
      setOpenAddRowModal(true);
      return;
    }
    if (getSelectedMaterialsIds().length === 0) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.noMaterialsSelected"),
        type: "error",
      });
      return;
    }
    if (
      action?.action === EMaterialsActions.UpdateIsActive ||
      action?.action === EMaterialsActions.UpdateIsInActive
    ) {
      await updateStatus(action?.action);
      return;
    }
    setAction(action);
  };

  const onTextInputChange = (v: string) => {
    setUpdatedValue(v);
  };

  const onInputChange = (key: string, v: any) => {
    setUpdatedValue(v);
  };

  const onUpdate = async () => {
    if (action !== null) {
      if (isAdmin) {
        await updateMaterialsPropApi(callApi, onUpdateCallBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: getSelectedMaterialsIds(),
          action: action.action,
          priceIndex: 0,
            isAllMaterialsChecked:isAllMaterialsChecked,
            uncheckedMaterials:uncheckedMaterials,
            tableFilters:{
                materialKey: materialType,
                categoryKey: materialCategory,
                supplierId,
                pageNumber:null,
                pageSize:null,
                isActive:
                    activeFilter === EMaterialActiveFilter.ACTIVE
                        ? true
                        : activeFilter === EMaterialActiveFilter.INACTIVE
                            ? false
                            : null,
                customFiltersKeyValueList:materialFilter,
            },
          exchangeRate: rate,
        });
      } else {
        await updatePrintHouseMaterialsPropApi(callApi, onUpdateCallBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: getSelectedMaterialsIds(),
          action: action.action,
          priceIndex: 0,
          updatedValue,
            isAllMaterialsChecked:isAllMaterialsChecked,
            uncheckedMaterials:uncheckedMaterials,
            tableFilters:{
                materialKey: materialType,
                categoryKey: materialCategory,
                supplierId,
                pageNumber:null,
                pageSize:null,
                isActive:
                    activeFilter === EMaterialActiveFilter.ACTIVE
                        ? true
                        : activeFilter === EMaterialActiveFilter.INACTIVE
                            ? false
                            : null,
                customFiltersKeyValueList:materialFilter,
            },
          exchangeRate: rate,
        });
      }
    }
  };

  const onUpdateCallBack = (res) => {
    if (res.success) {
      setMaterialCategoryData(
        materialCategoryData.map((material) =>
          material.checked
            ? {
                ...material,
                ...res.data?.find((row) => row.id === material.id),
              }
            : material
        )
      );
    }
    const updateStatus = async (eAction: EMaterialsActions) => {
        if(isAdmin){
            await updateMaterialsPropApi(callApi, onUpdateCallBack, {
                materialTypeKey: materialType.toString(),
                categoryKey: materialCategory.toString(),
                ids: getSelectedMaterialsIds(),
                action: eAction,
                isAllMaterialsChecked:isAllMaterialsChecked,
                uncheckedMaterials:uncheckedMaterials,
                tableFilters:{
                    materialKey: materialType,
                    categoryKey: materialCategory,
                    supplierId,
                    pageNumber:null,
                    pageSize:null,
                    isActive:
                        activeFilter === EMaterialActiveFilter.ACTIVE
                            ? true
                            : activeFilter === EMaterialActiveFilter.INACTIVE
                                ? false
                                : null,
                    customFiltersKeyValueList:materialFilter,
                },
                priceIndex: 0,
            })
        }else{
            await updatePrintHouseMaterialsPropApi(callApi, onUpdateCallBack, {
                materialTypeKey: materialType.toString(),
                categoryKey: materialCategory.toString(),
                ids: getSelectedMaterialsIds(),
                action: eAction,
                isAllMaterialsChecked:isAllMaterialsChecked,
                uncheckedMaterials:uncheckedMaterials,
                tableFilters:{
                    materialKey: materialType,
                    categoryKey: materialCategory,
                    supplierId,
                    isActive:
                        activeFilter === EMaterialActiveFilter.ACTIVE
                            ? true
                            : activeFilter === EMaterialActiveFilter.INACTIVE
                                ? false
                                : null,
                    customFiltersKeyValueList:materialFilter,
                },
                priceIndex: 0,
            })
        }
        
    }

    const downloadExcelFile = async () => {
        const callBack = (res) => {
            if (res.success) {
                const downloadLink = document.createElement("a");
                downloadLink.href = res.data; // Use the provided file URL
                downloadLink.download = materialType + ".xlsx"; // Replace with the desired file name
                downloadLink.click();
            }
        };
        await getMaterialExcelFileApi(callApi, callBack, materialType);
    };

    const uploadExcelFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);
                // Convert data to a Base64 string
                var base64String = btoa(
                    new Uint8Array(data).reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, "")
                );
                uploadMaterialExcelFileApi(callApi, () => {}, {
                    key: materialType.toString(),
                    base64: base64String,
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };
    return {
        getSelectedMaterialsIds,
        onChooseAction,
        action,
        updatedValue,
        onTextInputChange,
        onInputChange,
        uploadExcelFile,
        onUpdate,
        checkedPrice,
        setCheckedPrice,
        setRate,
        rate,
        elementRef
    }
}

export { useMaterialsActions };
