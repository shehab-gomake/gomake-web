import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import {
  activeFilterState,
  currenciesState,
  filterState,
  isAllMaterialsCheckedState,
  materialActionState,
  materialCategoryDataState,
  materialCategorySuppliersState,
  materialHeadersState,
  materialsUnCheckedState,
  openAddRowModalState, openCreatePurchaseOrderModalState, openUpdatedNumburingModalState, selectedMaterialIdForUpdateState,
  selectedSupplierIdState,
  openChildTableState,
  inventoryDataState,
  purchasePricingDataState,
} from "@/widgets/materials-widget/state";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EMaterialActiveFilter,
  EMaterialsActions,
} from "@/widgets/materials-widget/enums";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  getPrintHouseMaterialExcelFileApi,
  updatePrintHouseMaterialsPropApi,
  updatePrintHouseMaterialsRowsApi,
  uploadPrintHouseMaterialExcelFileApi,
  updateSupplierInventoryApi,
  updatePrintHouseMaterialSupplierApi
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {
  ActiveMaterial,
  AddNewMaterial,
  CurrencyMaterial,
  DeActiveMaterial,
  DeleteMaterial,
  DownloadExcelSheet,
  DuplicateMaterial,
  PercentageMaterial,
  UnitsPriceMaterial,
  UploadExcelSheet,
  UploadMaterialsPictures,
} from "@/icons";
import {
  createPurchaseOrderApi,
  getMaterialExcelFileApi,
  updateMaterialsImagesApi,
  updateMaterialsPropApi,
  uploadMaterialExcelFileApi,
} from "@/services/api-service/materials/materials-endpoints";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useMaterialsCategories } from "../../use-materials-categories";
import { EMaterialsTabsIcon, UNIT_TYPE } from "@/enums";
import { EHttpMethod } from "@/services/api-service/enums";
import { actionMenuState, openPriceModalState, userState } from "@/store";
import { useMaterials } from "@/widgets/materials-widget/use-materials";
import { CreateOrder } from "@/icons/material-tabs/create-order";
import { convertValueToOriginalUnit } from "@/utils/helpers";
import { useTableCellData } from "../table-cell-data/use-table-cell-data";

const useMaterialsActions = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0
  const { getMaterialCategories } = useMaterials(isAdmin);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get the table cell data functions for inventory updates
  const { updateInventoryTableData, updateMainTableData, updatePurchasePricingTableData } = useTableCellData(isAdmin, true, true);
  const { alertSuccessAdded, alertFaultAdded, alertFault, alertFaultUpdate } = useSnackBar();
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);
  const openChildTable: any = useRecoilValue(openChildTableState);

  const inventoryData = useRecoilValue(inventoryDataState);
  const purchasePricingData = useRecoilValue(purchasePricingDataState);
  const currencies: any = useRecoilValue(currenciesState);

  const [action, setAction] = useRecoilState<{
    action: EMaterialsActions;
    key: string;
    text?: string;
    parameterKey?: string;
    isInventoryTable?: boolean;
    isPurchasePricingTable?: boolean;
  } | null>(actionMenuState);
  const [updatedValue, setUpdatedValue] = useState<string>("");
  useEffect(() => {
    if (action === null && updatedValue != "") {
      setUpdatedValue("")
    }
    else if (action?.action === EMaterialsActions.CreatePurchaseOrder && updatedValue == "") {
      setUpdatedValue("1")
    }
  }, [action, updatedValue])
  const [currentCurrency, setCurrentCurrency] = useState<any>("");
  const [checkedPrice, setCheckedPrice] = useState(false);
  const { rate, setRate, getExchangeRate } = useExchangeRate();
  const [isAllMaterialsChecked, setIsAllMaterialsChecked] =
    useRecoilState<boolean>(isAllMaterialsCheckedState);
  const uncheckedMaterials = useRecoilValue<string[]>(materialsUnCheckedState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const activeFilter = useRecoilValue(activeFilterState);
  const [selectedMaterialIdForUpdate, setSelectedMaterialIdForUpdate] = useRecoilState(selectedMaterialIdForUpdateState);
  const materialFilter = useRecoilValue(filterState);
  const elementRef = useRef(null);
  const uploadImgRef = useRef(null);
  const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const setOpenAddRowModal = useSetRecoilState<boolean>(openAddRowModalState);
  const setOpenUpdatedNumburingModal = useSetRecoilState<boolean>(openUpdatedNumburingModalState);
  const setOpenCreatePurchaseOrderModal = useSetRecoilState<boolean>(openCreatePurchaseOrderModalState);

  const [selectedMaterialsIds, setSelectedMaterialsIds] = useState([]);

  useEffect(() => {
    const getSelectedMaterialsIds = () => materialCategoryData.filter((row) => row.checked).map((row) => row.id);
    const checkedIds = getSelectedMaterialsIds();
    // Prioritize multiple checkbox selections over single material update
    if (checkedIds.length > 0) {
      setSelectedMaterialsIds(checkedIds);
      // Clear single selection if we have multiple selections
      if (checkedIds.length > 1) {
        setSelectedMaterialIdForUpdate("");
      }
    } else if (selectedMaterialIdForUpdate) {
      setSelectedMaterialsIds([selectedMaterialIdForUpdate]);
    } else {
      setSelectedMaterialsIds([]);
    }

  }, [materialCategoryData, selectedMaterialIdForUpdate]);

  useEffect(() => {
    if (selectedMaterialsIds.length > 0) {
      const myId = selectedMaterialsIds[0];
      let currency = null;

      // Use action metadata to determine which table we're in
      if (action?.isPurchasePricingTable) {
        // We're specifically in purchase pricing table
        const purchaseRow = purchasePricingData?.find((row) => row.id === myId);
        if (purchaseRow) {
          // For purchase pricing, get currency from the row data structure
          currency = purchaseRow?.currency ||
            purchaseRow?.purchasePrice?.currency ||
            purchaseRow?.rowData?.currency?.value;
        }
      } else if (action?.isInventoryTable) {
        // We're specifically in inventory table
        const inventoryRow = inventoryData?.find((row) => row.id === myId);
        if (inventoryRow && action?.parameterKey) {
          // Use the specific currency based on which column was clicked
          if (action.parameterKey === 'saleCurrency') {
            currency = inventoryRow?.salePrice?.currency;
          } else {
            currency = inventoryRow?.purchasePrice?.currency;
          }
        } else if (inventoryRow) {
          // Fallback to purchase currency if no specific parameter key
          currency = inventoryRow?.purchasePrice?.currency || inventoryRow?.salePrice?.currency;
        }
      } else {
        // Fallback logic for when action metadata is not available
        // Check data presence as secondary method
        if (purchasePricingData && purchasePricingData.length > 0) {
          const purchaseRow = purchasePricingData.find((row) => row.id === myId);
          if (purchaseRow) {
            currency = purchaseRow?.currency || purchaseRow?.purchasePrice?.currency;
          }
        } else if (inventoryData && inventoryData.length > 0) {
          const inventoryRow = inventoryData.find((row) => row.id === myId);
          if (inventoryRow) {
            currency = inventoryRow?.purchasePrice?.currency || inventoryRow?.salePrice?.currency;
          }
        }
      }

      // If no currency found from inventory/purchase tables, or we're in main table, use main table data
      if (!currency) {
        const selectedRow = materialCategoryData.find((row) => row.id === myId);
        currency = selectedRow?.rowData?.currency?.value;
      }

      setCurrentCurrency(currency);
    }
  }, [selectedMaterialsIds, materialCategoryData, openChildTable, inventoryData, purchasePricingData, action]);

  const onChooseAction = async (
    action: { action: EMaterialsActions; key: string } | null
  ) => {

    if (action?.action === EMaterialsActions.AddNew) {
      setOpenAddRowModal(true);
      return;
    }
    if (action?.action === EMaterialsActions.sku) {
      setOpenUpdatedNumburingModal(true);
      return;
    }
    // if (action?.action === EMaterialsActions.CreatePurchaseOrder) {
    //   if (selectedMaterialsIds.length === 0) {
    //     setSnackbarStateValue({
    //       state: true,
    //       message: t("modal.noMaterialsSelected"),
    //       type: "error",
    //     });
    //     return;
    //   }
    //   else {
    //     setOpenCreatePurchaseOrderModal(true);
    //     return;
    //   }

    // }
    if (action?.action === EMaterialsActions.DownLoadExcel) {
      downloadExcelFile().then();
      return;
    }
    if (action?.action === EMaterialsActions.UploadExcel) {
      elementRef.current.click();
      return;
    }
    if (action?.action === EMaterialsActions.UploadMaterialsPictures) {
      uploadImgRef.current.click();
      return;
    }

    if (selectedMaterialsIds.length === 0) {
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
    if (action?.action === EMaterialsActions.UpdateCurrency) {
      let selectedMaterials = [];
      if (isAllMaterialsChecked) {
        selectedMaterials = selectedMaterials = materialCategoryData.filter(item =>
          !uncheckedMaterials.includes(item.id)
        );
      } else {
        selectedMaterials = materialCategoryData.filter(item =>
          selectedMaterialsIds.includes(item.id)
        );
      }
      const areCurrenciesSame = selectedMaterials.every(
        item => item.rowData.currency.value === selectedMaterials[0].rowData.currency.value
      );
      if (areCurrenciesSame) {
        setAction(action);
      }
      else {
        alertFault(t("materials.inputs.errorCurrencyMsg"));
      }

      return;
    }
    setAction(action);
    setSelectedMaterialIdForUpdate("");
    setUpdatedValue("")
  };

  const onTextInputChange = (v: string) => {
    setUpdatedValue(v);
  };

  const onInputChange = (key: string, v: any) => {
    setUpdatedValue(v);
  };
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1

  const [openUpdatedTableRowModal, setOpenUpdatedTableRowModal] = useState<boolean>(false);
  const onClickCloseUpdatedTableRowModal = () => {
    setOpenUpdatedTableRowModal(false);
  };

  const onClickOpenUpdatedTableRowModal = () => {
    setOpenUpdatedTableRowModal(true);
  };

  const updateMaterials = async (action, callApi, onUpdateCallBack, {
    materialType,
    materialCategory,
    isAllMaterialsChecked,
    selectedMaterialsIds,
    updatedValue,
    uncheckedMaterials,
    rate,
    activeFilter,
    materialFilter,
    supplierId
  }) => {
    if (!updatedValue || updatedValue === "") {
      alertFault(t("products.offsetPrice.admin.fillValue"));
      return;
    }

    // Check if we're updating currency in inventory or purchase table

    if (action.action === EMaterialsActions.UpdateCurrency) {
      // Check if this is from inventory or purchase table based on action metadata
      const isFromInventoryTable = action.isInventoryTable;
      const isFromPurchaseTable = action.isPurchasePricingTable;
      const currencyParameterKey = action.parameterKey;
      if (isFromInventoryTable || isFromPurchaseTable) {
        // For inventory/purchase tables, update individual rows using the specific endpoint
        const updatePromises = selectedMaterialsIds.map(async (rowId) => {
          const selectedCurrency = currencies?.find(c => c.value === updatedValue);
          const exchangeRate = rate || selectedCurrency?.exchangeRate || 1;

          // Determine pricing type based on parameterKey (like price updates do)
          let pricingType = 1; // Default to PurchasePrice
          if (currencyParameterKey && (currencyParameterKey.includes('sale') || currencyParameterKey.toLowerCase().includes('sale'))) {
            pricingType = 2; // SalesPrice
          }
          if (isFromInventoryTable) {
            // Use inventory endpoint with correct pricing type
            return await updateSupplierInventoryApi(callApi, (res) => {
              if (res.success && res.data) {
                updateInventoryTableData(rowId, res.data?.row);
              }
            }, {
              id: rowId,
              key: "currency",
              updatedValue: updatedValue,
              exchangeRate: exchangeRate,
              pricingType: pricingType,
            });
          }
          else if (isFromPurchaseTable) {
            // Use purchase pricing endpoint
            return await updatePrintHouseMaterialSupplierApi(callApi, (res) => {
              if (res.success && res.data) {
                updatePurchasePricingTableData(rowId, res.data);
              }
            }, {
              id: rowId,
              key: "currency",
              updatedValue: updatedValue,
              exchangeRate: exchangeRate,
              pricingType: 1,
            });
          }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
        onUpdateCallBack({ success: true });
        return;
      }
    }

    // Default behavior for main materials table
    return await updatePrintHouseMaterialsRowsApi(callApi, onUpdateCallBack, {
      materialTypeKey: materialType.toString(),
      categoryKey: materialCategory.toString(),
      ids: isAllMaterialsChecked ? [] : selectedMaterialsIds,
      action: action.action,
      priceIndex: 0,
      updatedValue,
      isAllMaterialsChecked: isAllMaterialsChecked,
      uncheckedMaterials: uncheckedMaterials,
      tableFilters: {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId,
        pageNumber: null,
        pageSize: null,
        isActive:
          activeFilter === EMaterialActiveFilter.ACTIVE
            ? true
            : activeFilter === EMaterialActiveFilter.INACTIVE
              ? false
              : null,
        customFiltersKeyValueList: materialFilter,
      },
      exchangeRate: rate,
    });
  };

  const updatedTableRowModal = async () => {
    await updateMaterials(action, callApi, onUpdateCallBack, {
      materialType,
      materialCategory,
      isAllMaterialsChecked,
      selectedMaterialsIds,
      updatedValue,
      uncheckedMaterials,
      rate,
      activeFilter,
      materialFilter,
      supplierId
    });
  }



  const onUpdate = async () => {
    if (action !== null) {
      if (isAdmin) {
        if (action.key === "Duplicate") {
          duplicateMaterials();
        }
        else if (action.key === "CreatePurchaseOrder") {
          CreatePurchaseOrder().then();
        }
        else {
          await updateMaterials(action, callApi, onUpdateCallBack, {
            materialType,
            materialCategory,
            isAllMaterialsChecked,
            selectedMaterialsIds,
            updatedValue,
            uncheckedMaterials,
            rate,
            activeFilter,
            materialFilter,
            supplierId: null
          });
        }
      } else {
        if (action.key === "Duplicate") {
          duplicatePrintHouseMaterials();
        }
        else if (action.key === "CreatePurchaseOrder") {
          CreatePurchaseOrder().then();
        }
        else if (action.key === "Delete") {
          await updateMaterials(action, callApi, onUpdateCallBack, {
            materialType,
            materialCategory,
            isAllMaterialsChecked,
            selectedMaterialsIds,
            updatedValue: "delete",
            uncheckedMaterials,
            rate,
            activeFilter,
            materialFilter,
            supplierId
          });
        }
        else if (
          isHaveMorethanMaterialSuppliers &&
          (action?.action !== EMaterialsActions.UpdateCurrency &&
            action?.action !== EMaterialsActions.UpdatePricePerTon &&
            action?.action !== EMaterialsActions.UpdatePricePerUnit &&
            action?.action !== EMaterialsActions.UpdatePricePerTonPercents &&
            action?.action !== EMaterialsActions.UpdatePricePerUnitPercents)
        ) {
          onClickOpenUpdatedTableRowModal();
        }
        else {
          await updateMaterials(action, callApi, onUpdateCallBack, {
            materialType,
            materialCategory,
            isAllMaterialsChecked,
            selectedMaterialsIds,
            updatedValue,
            uncheckedMaterials,
            rate,
            activeFilter,
            materialFilter,
            supplierId
          });
        }
      }
    }
  };
  const [openPriceModal, setOpenPriceModal] = useRecoilState<boolean>(openPriceModalState);

  const onClickOpenPriceModal = () => {
    setOpenPriceModal(true);
  };
  const onUpdateCallBack = (res) => {
    if (res.success) {
      if (action?.action === EMaterialsActions.Delete) {
        setMaterialCategoryData(
          materialCategoryData.filter((material) => !material.checked)
        )
        getMaterialCategoryData(
          materialType?.toString(),
          materialCategory?.toString(),
          [],
          supplierId
        ).then();
      }
      else {
        setMaterialCategoryData(
          materialCategoryData.map((material) =>
            material.checked || material.id === selectedMaterialIdForUpdate
              ? {
                ...material,
                ...res.data?.find((row) => row.id === material.id),
                checked: false,
              }
              : { ...material, checked: false }
          )
        )
      }
      if (action?.key.toLowerCase().includes("price") && !openPriceModal) {
        onClickOpenPriceModal();
      }
      setAction(null);
      setIsAllMaterialsChecked(false);

    }
    else {
      alertFaultUpdate();
    }
  };

  const updateStatus = async (eAction: EMaterialsActions) => {
    if (isAdmin) {
      const result = await updateMaterialsPropApi(callApi, onUpdateCallBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: materialCategory.toString(),
        ids: isAllMaterialsChecked ? [] : selectedMaterialsIds,
        action: eAction,
        isAllMaterialsChecked: isAllMaterialsChecked,
        uncheckedMaterials: uncheckedMaterials,
        tableFilters: {
          materialKey: materialType,
          categoryKey: materialCategory,
          supplierId: null,
          isActive:
            activeFilter === EMaterialActiveFilter.ACTIVE
              ? true
              : activeFilter === EMaterialActiveFilter.INACTIVE
                ? false
                : null,
          customFiltersKeyValueList: materialFilter,
        },
        priceIndex: 0,
      });
      if (result?.success) {
        getMaterialCategoryData(
          materialType?.toString(),
          materialCategory?.toString(),
          [],
          supplierId
        ).then();
      }
    } else {
      const result = await updatePrintHouseMaterialsRowsApi(
        callApi,
        onUpdateCallBack,
        {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: isAllMaterialsChecked ? [] : selectedMaterialsIds,
          action: eAction,
          isAllMaterialsChecked: isAllMaterialsChecked,
          uncheckedMaterials: uncheckedMaterials,
          tableFilters: {
            materialKey: materialType,
            categoryKey: materialCategory,
            supplierId,
            isActive:
              activeFilter === EMaterialActiveFilter.ACTIVE
                ? true
                : activeFilter === EMaterialActiveFilter.INACTIVE
                  ? false
                  : null,
            customFiltersKeyValueList: materialFilter,
          },
          priceIndex: 0,
        }
      );
      if (result?.success) {
        getMaterialCategoryData(
          materialType?.toString(),
          materialCategory?.toString(),
          [],
          supplierId
        ).then();
      }
    }
  };

  const downloadExcelFile = async () => {
    const callBack = (res) => {
      if (res.success) {
        const downloadLink = document.createElement("a");
        downloadLink.href = res.data; // Use the provided file URL
        downloadLink.download = materialType + ".xlsx"; // Replace with the desired file name
        downloadLink.click();
      }
    };
    if (isAdmin) {
      await getMaterialExcelFileApi(callApi, callBack, materialType);
    } else {
      await getPrintHouseMaterialExcelFileApi(callApi, callBack, materialType);
    }
  };

  const CreatePurchaseOrder = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        handleCloseModal();
        setTimeout(() => {
          navigate(`/purchaseOrder?Id=${res?.data}`);
        }, 400);
      }
      else {
        alertFaultAdded();
      }
    };
    await createPurchaseOrderApi(callApi, callBack, {
      materialTypeKey: materialType.toString(),
      categoryKey: materialCategory.toString(),
      ids: isAllMaterialsChecked ? [] : selectedMaterialsIds,
      action: EMaterialsActions.CreatePurchaseOrder,
      isAllMaterialsChecked: isAllMaterialsChecked,
      uncheckedMaterials: uncheckedMaterials,
      tableFilters: {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId,
        isActive:
          activeFilter === EMaterialActiveFilter.ACTIVE
            ? true
            : activeFilter === EMaterialActiveFilter.INACTIVE
              ? false
              : null,
        customFiltersKeyValueList: materialFilter,
      },
      quantity: null,
      package: updatedValue,
      priceIndex: 0,
    });
  };

  const uploadExcelFile = async (e) => {
    if (!materialType || !materialCategory) {
      alertFault("materials.inputs.errorNoMaterialTypeOrCategory");
      return;
    }
    if (!supplierId) {
      alertFault("materials.inputs.errorNoSupplierId");
      return;
    }
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
        let callBack = () => {
          getMaterialCategories(materialType).then(x => {
            getMaterialCategoryData(
              materialType?.toString(),
              materialCategory?.toString(),
              [],
              supplierId
            ).then();
          });

        }
        if (isAdmin) {
          uploadMaterialExcelFileApi(callApi, callBack, {
            key: materialType.toString(),
            base64: base64String,
          });
        } else {
          uploadPrintHouseMaterialExcelFileApi(callApi, callBack, {
            key: materialType.toString(),
            supplierId: supplierId,
            base64: base64String,
          });
        }

      };
      reader.readAsArrayBuffer(file);
    }
  };

  const updateMaterialsImages = async (e) => {
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
        updateMaterialsImagesApi(callApi, () => { }, {
          materialTypeKey: materialType.toString(),
          base64ZipFile: base64String,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const materialActions = useRecoilValue(materialActionState);

  const materialHeaders =
    useRecoilValue<
      { key: string; value: string; inputType: number; values: any[], isHideInDuplicate?: boolean }[]
    >(materialHeadersState);
  const [property, setProperty] = useState<any[]>();

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const _renderIcons = (iconName: string) => {
    if (iconName === EMaterialsTabsIcon.UPDATE_PRICE_PER_TON) {
      return <UnitsPriceMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.UPDATE_UNIT_PRICE) {
      return <UnitsPriceMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_PERCENT_TO_UNIT_PRICE) {
      return <PercentageMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_PERCENT_TO_PRICE_PER_TON) {
      return <PercentageMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.UPDATE_CURRENCY) {
      return <CurrencyMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.CHANGE_TO_ACTIVE) {
      return <ActiveMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.CHANGE_TO_INACTIVE) {
      return <DeActiveMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.ADD_NEW) {
      return <AddNewMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DUPLICATE) {
      return <DuplicateMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DELETE) {
      return <DeleteMaterial />;
    }
    if (iconName === EMaterialsTabsIcon.DOWNLOAD_EXCEL) {
      return <DownloadExcelSheet />;
    }
    if (iconName === EMaterialsTabsIcon.UPLOAD_EXCEL) {
      return <UploadExcelSheet />;
    }
    if (iconName === EMaterialsTabsIcon.Upload_Materials_Pictures) {
      return <UploadMaterialsPictures />;
    }
    if (iconName === EMaterialsTabsIcon.CREATE_PURCHASE_ORDER) {
      return <CreateOrder />;
    }
  };
  const deleteProperty = (index) => {
    const updatedProperty = [...properties];
    updatedProperty.splice(index, 1);
    setProperties(updatedProperty);
  };

  const initialProperties = {
    key: "",
    values: [""],
  };
  const [properties, setProperties] = useState<any>([initialProperties]);
  const addProperty = () => {
    setProperties([...properties, initialProperties]);
  };
  const handleChange = (index, field, value) => {
    const updatedProperties = [...properties];
    if (field === "values") {
      let currentValueArray = updatedProperties[index][field];
      const valueIndex = currentValueArray.indexOf(value);

      if (valueIndex === -1) {
        // Value doesn't exist, so add it
        currentValueArray = [...currentValueArray, value].filter(v => v !== "");
      } else {
        // Value exists, so remove it
        currentValueArray = currentValueArray.filter(v => v !== value);
        // If the array becomes empty, add the "" back to keep initial state consistent
        if (currentValueArray.length === 0) {
          currentValueArray = [""];
        }
      }

      // Flatten the array if it contains nested arrays
      const flattenedValues = currentValueArray.flat();

      // Create a new object with the updated values
      updatedProperties[index].key = { ...updatedProperties[index].key, values: flattenedValues };

      // Update the value array
      updatedProperties[index][field] = flattenedValues;
    } else {
      updatedProperties[index][field] = value;
    }
    setProperties(updatedProperties);
  };
  const duplicatePrintHouseMaterials = useCallback(async () => {
    // Filter out empty properties (where key is empty or undefined)
    const validProperties = properties.filter(item => item?.key?.key);

    // Check if any property has empty values
    const hasEmptyValues = validProperties.some(item =>
      !item.values ||
      item.values.length === 0 ||
      item.values.every(value => !value || value.trim() === '')
    );

    if (hasEmptyValues) {
      alertFault(t("materials.inputs.errorEmptyPropertyValue"));
      return;
    }

    const transformedArray = validProperties.map((item) => {
      const convertedValues = item.values.map(value =>
        unitType === UNIT_TYPE.IMPERIAL ?
          convertValueToOriginalUnit(item?.key?.unit, value) :
          value
      );
      const key = item?.key?.key?.toLowerCase();
      const value = convertedValues[convertedValues.length - 1];
      const uniqueValues = Array.from(new Set(convertedValues));

      return {
        key,
        value,
        values: uniqueValues
      };
    });

    const requestBody: any = {
      props: transformedArray,
      ids: isAllMaterialsChecked && !selectedMaterialIdForUpdate ? [] : selectedMaterialsIds,
      isAllMaterialsChecked: selectedMaterialIdForUpdate ? false : isAllMaterialsChecked,
      uncheckedMaterials: uncheckedMaterials,
      tableFilters: {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId: null,
        pageNumber: null,
        pageSize: null,
        isActive:
          activeFilter === EMaterialActiveFilter.ACTIVE
            ? true
            : activeFilter === EMaterialActiveFilter.INACTIVE
              ? false
              : null,
        customFiltersKeyValueList: materialFilter,
      },
    };
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/printhouse-materials/duplicate-print-house-materials`,
      requestBody
    );

    if (res?.success) {
      alertSuccessAdded();
      getMaterialCategoryData(
        materialType?.toString(),
        materialCategory?.toString(),
        [],
        supplierId
      ).then();
      setIsAllMaterialsChecked(false)
      handleCloseModal();
    } else {
      alertFaultAdded();
    }
  }, [properties, selectedMaterialsIds, selectedMaterialIdForUpdate]);
  const duplicateMaterials = useCallback(async () => {
    const transformedArray = properties.map((item) => {
      const convertedValues = item.values.map(value =>
        unitType === UNIT_TYPE.IMPERIAL ?
          convertValueToOriginalUnit(item?.key?.unit, value) :
          value
      );
      const key = item?.key?.key?.toLowerCase();
      const value = convertedValues[convertedValues.length - 1];
      const uniqueValues = Array.from(new Set(convertedValues));

      return {
        key,
        value,
        values: uniqueValues
      };
    });

    const requestBody: any = {
      props: transformedArray,
      ids: isAllMaterialsChecked ? [] : selectedMaterialsIds,
      isAllMaterialsChecked: isAllMaterialsChecked,
      uncheckedMaterials: uncheckedMaterials,
      tableFilters: {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId: null,
        pageNumber: null,
        pageSize: null,
        isActive:
          activeFilter === EMaterialActiveFilter.ACTIVE
            ? true
            : activeFilter === EMaterialActiveFilter.INACTIVE
              ? false
              : null,
        customFiltersKeyValueList: materialFilter,
      },
    };
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/materials/duplicate-materials`,
      requestBody
    );

    if (res?.success) {
      alertSuccessAdded();
      getMaterialCategoryData(
        materialType?.toString(),
        materialCategory?.toString(),
        [],
        supplierId
      ).then();
      handleCloseModal();
    } else {
      alertFaultAdded();
    }
  }, [properties]);

  const updateModalCurrency = (newCurrency) => {
    getExchangeRate(currentCurrency, newCurrency).then()
    setCheckedPrice(true);
    onTextInputChange(newCurrency);
  }
  const handleCloseModal = () => {
    onChooseAction(null);
    setProperty(null);
    setUpdatedValue(null);
    setProperties([initialProperties]);
  };
  return {
    selectedMaterialsIds,
    onChooseAction,
    action,
    updatedValue,
    onTextInputChange,
    onInputChange,
    uploadExcelFile,
    updateMaterialsImages,
    onUpdate,
    checkedPrice,
    setCheckedPrice,
    setRate,
    rate,
    elementRef,
    uploadImgRef,
    handleMoreOptionIconClick,
    anchorEl,
    handleCloseMenu,
    materialActions,
    _renderIcons,
    handleCloseModal,
    currencies,
    properties,
    materialHeaders,
    handleChange,
    deleteProperty,
    addProperty,
    updateModalCurrency,
    CreatePurchaseOrder,
    openUpdatedTableRowModal,
    onClickCloseUpdatedTableRowModal,
    updatedTableRowModal
  };
};

export { useMaterialsActions };
