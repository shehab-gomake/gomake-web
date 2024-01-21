import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import {
  activeFilterState,
  currenciesState,
  filterState,
  isAllMaterialsCheckedState,
  materialActionState,
  materialCategoryDataState,
  materialHeadersState,
  materialsUnCheckedState,
  openAddRowModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  EMaterialActiveFilter,
  EMaterialsActions,
} from "@/widgets/materials-widget/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { updatePrintHouseMaterialsPropApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
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
  getMaterialExcelFileApi,
  updateMaterialsImagesApi,
  updateMaterialsPropApi,
  uploadMaterialExcelFileApi,
} from "@/services/api-service/materials/materials-endpoints";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import { useMaterialsCategories } from "../../use-materials-categories";
import { EMaterialsTabsIcon } from "@/enums";
import { EHttpMethod } from "@/services/api-service/enums";
import { actionMenuState } from "@/store";

const useMaterialsActions = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);
  const [action, setAction] = useRecoilState<{
    action: EMaterialsActions;
    key: string;
  } | null>(actionMenuState);
  const [updatedValue, setUpdatedValue] = useState<string>("");
  const [currentCurrency, setCurrentCurrency] = useState<any>("");
  const [checkedPrice, setCheckedPrice] = useState(false);
  const { rate, setRate, getExchangeRate } = useExchangeRate();
  const [isAllMaterialsChecked, setIsAllMaterialsChecked] =
    useRecoilState<boolean>(isAllMaterialsCheckedState);
  const uncheckedMaterials = useRecoilValue<string[]>(materialsUnCheckedState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const activeFilter = useRecoilValue(activeFilterState);
  const materialFilter = useRecoilValue(filterState);
  const elementRef = useRef(null);
  const uploadImgRef = useRef(null);
  const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
  useEffect(() => {
    if (checkedPrice) getExchangeRate(currentCurrency, updatedValue);
  }, [checkedPrice, updatedValue, currentCurrency]);
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const setOpenAddRowModal = useSetRecoilState<boolean>(openAddRowModalState);
  const [selectedMaterialsIds, setSelectedMaterialsIds] = useState([]);

  const onChangeHeaderCheckBox = useCallback(
    (isAllChecked: boolean) => {
      setIsAllMaterialsChecked(isAllChecked);
      const materialsIds = materialCategoryData.map((material) => material.id);
      setMaterialCategoryData(
        materialCategoryData.map((row) =>
          materialsIds.includes(row.id)
            ? {
                ...row,
                checked: false,
              }
            : { ...row, checked: false }
        )
      );
    },
    [materialCategoryData, materialCategoryData]
  );
  useEffect(() => {
    const getSelectedMaterialsIds = () =>
      materialCategoryData.filter((row) => row.checked).map((row) => row.id);

    setSelectedMaterialsIds(getSelectedMaterialsIds());
  }, [materialCategoryData]);
  useEffect(() => {
    if (selectedMaterialsIds.length > 0) {
      const myId = selectedMaterialsIds[0];
      const selectedRow = materialCategoryData.find((row) => row.id === myId);
      setCurrentCurrency(selectedRow?.rowData?.currency?.value);
    }
  }, [selectedMaterialsIds, materialCategoryData]);

  // useEffect(() => {
  //   if (action === null) {
  //     onChangeHeaderCheckBox(true);
  //   }
  // }, [action]);
  const onChooseAction = async (
    action: { action: EMaterialsActions; key: string } | null
  ) => {
    if (action?.action === EMaterialsActions.AddNew) {
      setOpenAddRowModal(true);
      return;
    }
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
        if (action.key === "Duplicate") {
          duplicateMaterials();
        }else{
          await updateMaterialsPropApi(callApi, onUpdateCallBack, {
            materialTypeKey: materialType.toString(),
            categoryKey: materialCategory.toString(),
            ids: selectedMaterialsIds,
            action: action.action,
            priceIndex: 0,
            isAllMaterialsChecked: isAllMaterialsChecked,
            uncheckedMaterials: uncheckedMaterials,
            tableFilters: {
              materialKey: materialType,
              categoryKey: materialCategory,
              supplierId:null,
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
        }
      } else {
        if (action.key === "Duplicate") {
          duplicatePrintHouseMaterials();
        } else {
          await updatePrintHouseMaterialsPropApi(callApi, onUpdateCallBack, {
            materialTypeKey: materialType.toString(),
            categoryKey: materialCategory.toString(),
            ids: selectedMaterialsIds,
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
        }
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
      setAction(null);
      onChangeHeaderCheckBox(true);
    }
  };
  const updateStatus = async (eAction: EMaterialsActions) => {
    if (isAdmin) {
      const result = await updateMaterialsPropApi(callApi, onUpdateCallBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: materialCategory.toString(),
        ids: selectedMaterialsIds,
        action: eAction,
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
      const result = await updatePrintHouseMaterialsPropApi(
        callApi,
        onUpdateCallBack,
        {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: selectedMaterialsIds,
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
        updateMaterialsImagesApi(callApi, () => {}, {
          materialTypeKey: materialType.toString(),
          base64ZipFile: base64String,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const currencies = useRecoilValue(currenciesState);
  const materialActions = useRecoilValue(materialActionState);

  const materialHeaders =
    useRecoilValue<
      { key: string; value: string; inputType: number; values: any[] }[]
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
  };
  const initialProperties = {
    key: "",
    value: "",
  };
  const [properties, setProperties] = useState<any>([initialProperties]);
  const addProperty = () => {
    setProperties([...properties, initialProperties]);
  };
  const deleteProperty = (index) => {
    const updatedProperty = [...properties];
    updatedProperty.splice(index, 1);
    setProperties(updatedProperty);
  };
  const handleChange = (index, field, value) => {
    const updatedProperty = [...properties];
    updatedProperty[index][field] = value;
    setProperties(updatedProperty);
  };
  const duplicatePrintHouseMaterials = useCallback(async () => {
    const transformedArray = properties.map((item) => {
      const key = item.key.key.toLowerCase();
      const value = item.value;

      return {
        key,
        value,
      };
    });

    const requestBody: any = {
      props: transformedArray,
      ids: selectedMaterialsIds,
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
      handleCloseModal();
    } else {
      alertFaultAdded();
    }
  }, [properties]);

  const duplicateMaterials = useCallback(async () => {
    const transformedArray = properties.map((item) => {
      const key = item.key.key.toLowerCase();
      const value = item.value;

      return {
        key,
        value,
      };
    });

    const requestBody: any = {
      props: transformedArray,
      ids: selectedMaterialsIds,
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
  const handleCloseModal = () => {
    onChooseAction(null);
    setProperty(null);
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
  };
};

export { useMaterialsActions };
