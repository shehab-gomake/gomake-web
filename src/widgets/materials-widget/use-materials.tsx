import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  deleteMaterialCategoryApi,
  getMaterialCategoriesApi,
  getMaterialTableHeadersApi,
  uploadMaterialExcelFileApi,
} from "@/services/api-service/materials/materials-endpoints";
import {
  deletePrintHouseMaterialCategoryApi,
  getPrintHouseMaterialCategoriesApi,
  uploadPrintHouseMaterial1RowExcelFileApi,
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { TableCellData } from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import { Checkbox } from "@mui/material";
import { getCurrencies } from "@/services/api-service/general/enums";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  activeFilterState,
  currenciesState,
  filterState,
  flagState,
  isAllMaterialsCheckedState,
  materialActionState,
  materialCategoriesState,
  materialCategoryDataState,
  materialCategorySuppliersState,
  materialHeadersState,
  materialsClientsState,
  materialsMachinesState,
  materialsTablePageState,
  materialsUnCheckedState,
  materialTypeTableState,
  openChildTableState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { useTranslation } from "react-i18next";
import { useAddCategoryRow } from "./components/add-row/use-add-row";
import { getAndSetAllCustomers, getAndSetMachincesNew } from "@/services/hooks";
import { MaterialMenuWidget } from "./components/more-circle";
import cloneDeep from "lodash.clonedeep";
import { SideLeftMenuWidget } from "./components/side-list-menu";
import { useTableCellData } from "./components/table-cell-data/use-table-cell-data";
import { useMaterialsCategories } from "./use-materials-categories";
import { convertTitleUnits } from "@/utils/helpers";
import { isLoadingMaterialsState, userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { EMaterialActiveFilter } from "./enums";

const useMaterials = (isAdmin: boolean) => {
  const { query, push, replace } = useRouter();
  const { materialType, materialCategory } = query;
  const [selectedTableRow, setSelectedTableRow] =
    useState<IMaterialCategoryRow>();
  const [requestAbortController, setRequestAbortController] = useState<AbortController | null>(null);

  const [materialHeaders, setMaterialHeaders] =
    useRecoilState<
      { key: string; value: string; unit?: string; isShowInExtraParameters?: boolean; isForAdmin?: boolean }[]
    >(materialHeadersState);

  const [materialCategories, setMaterialCategories] = useRecoilState<
    {
      categoryKey: string;
      categoryName: string;
      isDeletable: boolean;
      imageURL?: string | null;
    }[]
  >(materialCategoriesState);

  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);

  const resetMaterialCategoryData = useResetRecoilState(
    materialCategoryDataState
  );

  const [isAllMaterialsChecked, setIsAllMaterialsChecked] =
    useRecoilState<boolean>(isAllMaterialsCheckedState);
  const [materialsUnChecked, setMaterialsUnChecked] = useRecoilState<string[]>(
    materialsUnCheckedState
  );
  const [openDeleteRowModal, setOpenDeleteRowModal] = useState<boolean>(false);
  const onClickCloseDeleteRowModal = () => {
    setOpenDeleteRowModal(false);
  };
  const onClickOpenDeleteRowModal = (category) => {
    setSelectedCategory(category);
    setOpenDeleteRowModal(true);
  };
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] =
    useState<boolean>(false);
  const [
    openDeleteTableRowWhenHaveMoreSupplierModal,
    setOpenDeleteTableRowWhenHaveMoreSupplierModal,
  ] = useState<boolean>(false);

  // Duplicates/Deleted materials modal state
  const [openDuplicatesModal, setOpenDuplicatesModal] = useState<boolean>(false);
  const [duplicatesData, setDuplicatesData] = useState<any[]>([]);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = (dataRow) => {
    setSelectedTableRow(dataRow);
    setOpenDeleteTableRowModal(true);
  };

  const onClickCloseDeleteTableRowWhenHaveMoreSupplierModal = () => {
    setOpenDeleteTableRowWhenHaveMoreSupplierModal(false);
  };

  const onClickOpenDeleteTableRowWhenHaveMoreSupplierModal = (dataRow) => {
    setSelectedTableRow(dataRow);
    setOpenDeleteTableRowWhenHaveMoreSupplierModal(true);
  };

  const setMaterialCategorySuppliers = useSetRecoilState(
    materialCategorySuppliersState
  );
  const { updateCellData } = useTableCellData(isAdmin);
  const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
  const toggleIsActive = async (id, parameterKey, value) => {
    await updateCellData(id, parameterKey, !value);
    getMaterialCategoryData(
      materialType?.toString(),
      materialCategory?.toString(),
      materialFilter,
      supplierId
    ).then();
  };

  const [materialName, setMaterialName] = useState<string>();
  const setMaterialActions = useSetRecoilState(materialActionState);
  const setMaterialTypeTable = useSetRecoilState(materialTypeTableState);
  const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);
  const [materialFilter, setMaterialFilter] = useRecoilState(filterState);
  const { callApi } = useGomakeAxios();
  const { alertSuccessDelete, alertFaultDelete, alertFault, alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const setCurrencies = useSetRecoilState(currenciesState);
  const { onDeleteCategoryRow } = useAddCategoryRow(isAdmin);
  const setFlagState = useSetRecoilState(flagState);
  const { t } = useTranslation();
  const [pageNumber, setPageNumber] = useRecoilState(materialsTablePageState);
  const [supplierId, setSupplierId] = useRecoilState(selectedSupplierIdState);
  const [selectedMaterialCategory, setSelectedMaterialCategory] =
    useState<any>();
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const setIsLoadingMaterials = useSetRecoilState<boolean>(isLoadingMaterialsState);
  const setOpenChildTable = useSetRecoilState(openChildTableState);
  const onSelectCategory = (category: string) => {
    setIsFirstTime(false);
    setSelectedMaterialCategory(category);
    if (category != materialCategory) {
      setMaterialCategoryData([]);
      setIsLoadingMaterials(true);
    }
    // Reset child table state when changing categories
    setOpenChildTable({ rowId: '', tableType: null });
    setSupplierId("");
    setDefaultSupplier("");
    const path = isAdmin ? "/materials-admin" : "/materials";
    push(path + `/${materialType}?materialCategory=${category}`);
    setFlagState(false);
    setActiveFilter(EMaterialActiveFilter.ACTIVE);
    setIsAllMaterialsChecked(false);
    setMaterialFilter([]);
    setPageNumber(1);
  };

  const onDeleteCategory = async (categoryKey) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        setMaterialCategoryData([]);
        getMaterialCategories(materialType).then();
      } else {
        alertFaultDelete();
      }
    };
    if (isAdmin) {
      await deleteMaterialCategoryApi(callApi, callBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: categoryKey,
      });
    } else {
      await deletePrintHouseMaterialCategoryApi(callApi, callBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: categoryKey,
      });
    }
  };

  const getMaterialCategories = async (material) => {
    const callBack = (res) => {
      if (res?.success) {
        // Map the response to include imageURL
        const categoriesWithImages = res?.data?.map((category) => ({
          ...category,
          imageURL: category.imageURL || null
        }));
        setMaterialCategories(categoriesWithImages);
      } else {
        // push("/materials");
      }
    };
    if (isAdmin) {
      await getMaterialCategoriesApi(callApi, callBack, material);
    } else {
      await getPrintHouseMaterialCategoriesApi(callApi, callBack, material);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const materialsCategoriesList = useCallback(() => {
    return materialCategories.map((category) => ({
      ...category,
      text: category.categoryName,
      value: category.categoryKey,
      icon: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Category Image - only show container if image exists */}
          {category.imageURL && category.imageURL !== "" && (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0'
            }}>
              <img
                src={category.imageURL}
                alt={category.categoryName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Action Menu */}
          <SideLeftMenuWidget
            onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
            category={category}
          />
        </div>
      ),
    }));
  }, [materialCategories]);

  // Helper function to translate header values
  const translateHeaderValue = (key: string, originalValue: string) => {
    const convertedUnit =
      unitType === UNIT_TYPE.IMPERIAL
        ? convertTitleUnits(key)
        : key;
    // Special case for "price Unit / ton"
    if (key === "price Unit / ton") {
      return <div>
        {t("materials.childTable.priceUnitPerTon")}
        <br />
        {t(`measurementUnits.${convertedUnit}`)}
      </div>;
    }

    // Convert key to camelCase for translation lookup
    const translationKey = key
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');

    // Try to get translation, fallback to original value
    const translationPath = `materials.tableHeaders.${translationKey}`;
    const translatedValue = t(translationPath);

    // If translation key doesn't exist, t() returns the key itself, so we check if it's different
    return translatedValue !== translationPath ? translatedValue : originalValue;
  };

  // Helper function to translate values array
  const translateValuesArray = (values: any[]) => {
    return values.map(item => ({
      ...item,
      value: translateHeaderValue(item.key, item.value)
    }));
  };

  const getMaterialTableHeaders = async (materialType: string) => {
    const callBack = (res) => {
      if (res.success) {
        const tableHeaders = res.data?.tableHeaders;
        // Translate header values
        const translatedHeaders = tableHeaders.map(header => ({
          ...header,
          value: translateHeaderValue(header.key, header.value),
          values: header.values ? translateValuesArray(header.values) : header.values
        }));

        const updatedArray = translatedHeaders
        setMaterialHeaders(updatedArray);
        setMaterialTypeTable(res.data);
        setMaterialActions(res.data?.actions);
        setMaterialName(res.data?.materialTypeName);
      }
    };
    await getMaterialTableHeadersApi(callApi, callBack, materialType);
  };

  const isAllSelected = useCallback(() => {
    return materialCategoryData?.every((row) => row.checked);
  }, [materialCategoryData]);

  const onChangeHeaderCheckBox = useCallback(
    (isAllChecked: boolean) => {
      setIsAllMaterialsChecked(isAllChecked);
      const checked = isAllSelected();
      const materialsIds = materialCategoryData.map((material) => material.id);
      setMaterialCategoryData(
        materialCategoryData.map((row) =>
          materialsIds.includes(row.id)
            ? {
              ...row,
              checked: !checked,
            }
            : { ...row, checked: false }
        )
      );
    },
    [materialCategoryData, materialCategoryData, isAllSelected()]
  );

  const onChangeRowCheckBox = (id: string, checked: boolean) => {
    if (isAllMaterialsChecked && !checked) {
      const temp = cloneDeep(materialsUnChecked);
      temp.push(id);
      setMaterialsUnChecked(temp);
    }
    if (isAllMaterialsChecked && checked) {
      setMaterialsUnChecked(
        materialsUnChecked.filter((materialId) => materialId != id)
      );
    }

    const updatedData = materialCategoryData.map((row) =>
      id === row.id ? { ...row, checked: checked } : row
    );

    setMaterialCategoryData(updatedData);
  };

  const tableHeaders = useCallback(() => {
    return [
      <Checkbox
        onChange={(event, checked) => onChangeHeaderCheckBox(checked)}
        checked={isAllSelected()}
      />,
      ...materialHeaders.map((header) => header.value),
    ];
  }, [materialHeaders, materialCategoryData]);
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;

  const tableHeadersNew = useCallback(() => {
    return [
      <Checkbox
        onChange={(event, checked) => onChangeHeaderCheckBox(checked)}
        checked={isAllSelected()}
      />,
      ...(isAdmin
        ? materialHeaders.filter((x) => x.key !== "stock" && !x.isShowInExtraParameters)
        : materialHeaders.filter((header) => !header.isForAdmin && !header.isShowInExtraParameters)
      ).map((header) => {
        const convertedUnit =
          unitType === UNIT_TYPE.IMPERIAL
            ? convertTitleUnits(header.unit)
            : header.unit;



        return header.unit ? (
          <div>
            {" "}
            <div key={header.key}>
              <span> {header.value} </span>
              {convertedUnit &&
                <small>
                  ({t(`measurementUnits.${convertedUnit}`)})
                </small>}
            </div>
          </div>
        ) : (
          <div style={{ textTransform: "capitalize" }}>{header.value}</div>
        );
      }),
      // t("usersSettings.isActive"),
      " ",
    ];
  }, [materialHeaders, materialCategoryData]);

  const tableRows = useMemo(() => {
    return materialCategoryData.map((dataRow) => {
      return [
        <Checkbox
          onChange={(e, checked) => onChangeRowCheckBox(dataRow.id, checked)}
          checked={dataRow.checked}
        />,
        ...materialHeaders.map((header) => (
          <TableCellData
            {...dataRow.rowData[header.key]}
            id={dataRow.id}
            parameterKey={header.key}
            isAdmin={isAdmin}
            onChangeRowCheckBox={onChangeRowCheckBox}
          />
        )),
        <MaterialMenuWidget
          dataRow={dataRow}
          isAdmin={isAdmin}
          onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
          onChangeRowCheckBox={onChangeRowCheckBox}
          onClickOpenDeleteTableRowWhenHaveMoreSupplierModal={
            onClickOpenDeleteTableRowWhenHaveMoreSupplierModal
          }
          toggleIsActive={toggleIsActive}
        />,
      ];
    });
  }, [materialHeaders, materialCategoryData, activeFilter, materialFilter]);

  const tableRowsNew = useMemo(() => {
    const rows = [];

    materialCategoryData.forEach((dataRow) => {
      const filteredHeaders = isAdmin
        ? materialHeaders.filter((x) => x.key !== "stock" && !x.isShowInExtraParameters)
        : materialHeaders.filter((header) => !header.isForAdmin && !header.isShowInExtraParameters);

      // Main row
      rows.push({
        id: dataRow.id,
        cells: [
          <Checkbox
            onChange={(e, checked) => onChangeRowCheckBox(dataRow.id, checked)}
            checked={dataRow.checked}
          />,
          ...filteredHeaders.map((header) => (
            <TableCellData
              {...dataRow.rowData[header.key]}
              id={dataRow.id}
              isAdmin={isAdmin}
              unit={header.unit}
              parameterKey={header.key}
              onChangeRowCheckBox={onChangeRowCheckBox}
              rowData={dataRow.rowData}
            />
          )),
          // Add suppliers column manually since it's now static
          // dataRow?.isActive
          //   ? <span style={{ color: "green" }}>{t("usersSettings.active")}</span>
          //   : <span style={{ color: "red" }}>{t("usersSettings.inactive")}</span>,

          <MaterialMenuWidget
            dataRow={dataRow}
            isAdmin={isAdmin}
            onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
            onChangeRowCheckBox={onChangeRowCheckBox}
            onClickOpenDeleteTableRowWhenHaveMoreSupplierModal={
              onClickOpenDeleteTableRowWhenHaveMoreSupplierModal
            }
            toggleIsActive={toggleIsActive}
          />,
        ]
      });
    });

    return rows;
  }, [
    materialHeaders,
    materialCategoryData,
    isAdmin,
    activeFilter,
    materialFilter,
  ]);

  const getCurrenciesApi = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCurrencies(
          res.data.map(({ value, text }) => ({ label: text, value }))
        );
      }
    };
    await getCurrencies(callApi, callBack);
  };
  const elementRef = useRef(null);
  const getPrintHouseMaterialCategorySuppliers = async (
    materialType: string,
    materialCategory: string
  ) => {
    resetMaterialCategoryData();
    const newRequestAbortController = new AbortController();
    setRequestAbortController(newRequestAbortController);

    const callBack = (res) => {
      if (res.success) {
        const supplier = res?.data[0];
        setSupplierId(supplier?.id);
        setIsLoadingMaterials(false);

        setMaterialCategorySuppliers(
          res?.data?.map((supplier) => {
            if (supplier.isDefault) {
              setDefaultSupplier(supplier.id);
            }
            return {
              isDefault: supplier.isDefault,
              value: supplier.id,
              label: supplier.name,
              order: supplier?.order,
              name: supplier?.name,
              id: supplier?.id,
            };
          })
        );
      }
    };
    await getMaterialSuppliersApi(callApi, callBack, {
      key: materialType,
      categoryName: materialCategory,
    },
      true,
      newRequestAbortController
    );
  };

  const setMachinesState = useSetRecoilState<[]>(materialsMachinesState);
  const getMachinesMaterials = useCallback(async () => {
    await getAndSetMachincesNew(callApi, setMachinesState);
  }, []);

  const setClientsState = useSetRecoilState<[]>(materialsClientsState);
  const getClientsMaterials = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setClientsState, {
      clientType: "C",
      onlyCreateOrderClients: true,
    });
  }, []);

  const uploadExcelFile = async (e) => {
    if (!materialType || !materialCategory) {
      alertFault("materials.inputs.errorNoMaterialTypeOrCategory");
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
        let callBack = (res) => {
          if (res.success) {
            alertSuccessAdded();
            if (res?.data?.length > 0) {
              // Open modal with duplicates/deleted materials
              setDuplicatesData(res.data);
              setOpenDuplicatesModal(true);
            }
          } else {
            alertFaultAdded();
          }
        };
        if (isAdmin) {
          uploadMaterialExcelFileApi(callApi, callBack, {
            key: materialType.toString(),
            base64: base64String,
          });
        } else {
          uploadPrintHouseMaterial1RowExcelFileApi(callApi, callBack, {
            key: materialType.toString(),
            supplierId: supplierId,
            base64: base64String,
          });
        }

      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleRefreshMaterialData = () => {
    console.log("handleRefreshMaterialData", { materialType, materialCategory });

    // Refresh materials data - calls v1/printhouse-materials/get-print-house-material-category-data-new for non-admin
    if (materialType && materialCategory) {
      getMaterialCategoryData(
        materialType?.toString(),
        materialCategory?.toString(),
        materialFilter,
        supplierId,
        1, // pageNumber
        20, // pageSize
        false // appendMode
      ).then(() => {
        console.log('Materials data refreshed');
      });
    }
  };

  const handleDeleteSelectedMaterials = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) return;

    const deleteCallBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        // Close modal and refresh data
        setOpenDuplicatesModal(false);
        setDuplicatesData([]);
        handleRefreshMaterialData();
      } else {
        alertFaultDelete();
      }
    };

    // Use the delete API endpoint
    if (isAdmin) {
      // For admin, delete directly
      // You may need to implement the admin delete API call here
      console.log("Deleting materials (admin):", selectedIds);
      // For now, just close the modal and refresh
      setOpenDuplicatesModal(false);
      setDuplicatesData([]);
      handleRefreshMaterialData();
    } else {
      // For print house, use the existing delete endpoint
      // Note: You'll need to implement the actual delete API call based on your backend
      console.log("Deleting materials:", selectedIds);
      // For now, just close the modal and refresh
      setOpenDuplicatesModal(false);
      setDuplicatesData([]);
      handleRefreshMaterialData();
    }
  };

  const handleCloseDuplicatesModal = () => {
    setOpenDuplicatesModal(false);
    setDuplicatesData([]);
  };

  return {
    materialCategory,
    materialType,
    materialsCategoriesList,
    onSelectCategory,
    tableHeaders,
    tableRows,
    getCurrenciesApi,
    getMaterialCategories,
    getMaterialTableHeaders,
    getPrintHouseMaterialCategorySuppliers,
    materialCategoryData,
    materialCategories,
    replace,
    tableHeadersNew,
    tableRowsNew,
    getMachinesMaterials,
    materialFilter,
    openDeleteRowModal,
    onClickCloseDeleteRowModal,
    onDeleteCategory,
    selectedCategory,
    openDeleteTableRowModal,
    openDeleteTableRowWhenHaveMoreSupplierModal,
    onClickCloseDeleteTableRowModal,
    onDeleteCategoryRow,
    selectedTableRow,
    materialName,
    getClientsMaterials,
    onClickCloseDeleteTableRowWhenHaveMoreSupplierModal,
    toggleIsActive,
    selectedMaterialCategory,
    setSelectedMaterialCategory,
    uploadExcelFile,
    elementRef,
    onChangeRowCheckBox,
    onClickOpenDeleteTableRowModal,
    onClickOpenDeleteTableRowWhenHaveMoreSupplierModal,
    // Duplicates/Deleted modal
    openDuplicatesModal,
    duplicatesData,
    handleDeleteSelectedMaterials,
    handleCloseDuplicatesModal,
    handleRefreshMaterialData,
    materialHeaders,
  };
};

export { useMaterials };
