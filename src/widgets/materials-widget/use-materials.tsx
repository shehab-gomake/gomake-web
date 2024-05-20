import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  deleteMaterialCategoryApi,
  getMaterialCategoriesApi,
  getMaterialTableHeadersApi,
} from "@/services/api-service/materials/materials-endpoints";
import {
  deletePrintHouseMaterialCategoryApi,
  getPrintHouseMaterialCategoriesApi,
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { TableCellData } from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import { getCurrencies } from "@/services/api-service/general/enums";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  materialsUnCheckedState,
  openAddRowModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { useTranslation } from "react-i18next";
import { useAddCategoryRow } from "./components/add-row/use-add-row";
import { WastebasketNew } from "@/icons/wastebasket-new";

import { getAndSetAllCustomers, getAndSetMachincesNew } from "@/services/hooks";
import { MaterialMenuWidget } from "./components/more-circle";
import cloneDeep from "lodash.clonedeep";
import { SideLeftMenuWidget } from "./components/side-list-menu";
import { EMaterialActiveFilter } from "@/widgets/materials-widget/enums";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";

const useMaterials = (isAdmin: boolean) => {
  const { query, push, replace } = useRouter();
  const { productList } = useAllProductsDropDownList()
  const { materialType, materialCategory } = query;
  const [selectedTableRow, setSelectedTableRow] = useState<IMaterialCategoryRow>();

  const [materialHeaders, setMaterialHeaders] =
    useRecoilState<{ key: string; value: string; unit?: string, isForAdmin?: boolean }[]>(
      materialHeadersState
    );
  const [materialCategories, setMaterialCategories] = useRecoilState<
    {
      categoryKey: string;
      categoryName: string;
      isDeletable: boolean;
    }[]
  >(materialCategoriesState);
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);
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
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = (dataRow) => {
    setSelectedTableRow(dataRow)
    setOpenDeleteTableRowModal(true);
  };
  const setMaterialCategorySuppliers = useSetRecoilState(
    materialCategorySuppliersState
  );
  const [materialName, setMaterialName] = useState<string>();
  const setMaterialActions = useSetRecoilState(materialActionState);
  const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);
  const [materialFilter, setMaterialFilter] = useRecoilState(filterState);
  const { callApi } = useGomakeAxios();
  const { alertSuccessDelete, alertFaultDelete } = useSnackBar();
  const setCurrencies = useSetRecoilState(currenciesState);
  const { onDeleteCategoryRow } = useAddCategoryRow(isAdmin);
  const setFlagState = useSetRecoilState(flagState);
  const { t } = useTranslation();

  const onSelectCategory = (category: string) => {
    setDefaultSupplier("");
    const path = isAdmin ? "/materials-admin" : "/materials";
    push(path + `/${materialType}?materialCategory=${category}`);
    setFlagState(false);
    setActiveFilter(EMaterialActiveFilter.ACTIVE);
    setIsAllMaterialsChecked(false)
    setMaterialFilter([])
  };
  const onDeleteCategory = async (categoryKey) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        setMaterialCategoryData([])
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
        setMaterialCategories(res?.data);
      } else {
        push("/materials");
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
      text: category.categoryName,
      value: category.categoryKey,
      icon: category.isDeletable
        ? () => (
          <SideLeftMenuWidget
            onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
            category={category}
          />
        )
        : null,
    }));
  }, [materialCategories]);

  const getMaterialTableHeaders = async (materialType: string) => {
    const callBack = (res) => {
      if (res.success) {
        const tableHeaders = res.data?.tableHeaders;
        const updatedArray = tableHeaders.filter(
          (item) => item.key !== "Active"
        );
        setMaterialHeaders(updatedArray);
        setMaterialActions(res.data?.actions);
        setMaterialName(res.data?.materialTypeName);
      }
    };
    await getMaterialTableHeadersApi(callApi, callBack, materialType);
  };

  const isAllSelected = useCallback(() => {
    return materialCategoryData.every((row) => row.checked);
  }, [materialCategoryData]);

  const onChangeHeaderCheckBox = useCallback(
    (isAllChecked: boolean) => {
      debugger
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
    setMaterialCategoryData(
      materialCategoryData.map((row) =>
        id === row.id ? { ...row, checked: checked } : row
      )
    );
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

  const tableHeadersNew = useCallback(() => {
    return [
      <Checkbox
        onChange={(event, checked) => onChangeHeaderCheckBox(checked)}
        checked={isAllSelected()}
      />,
      ...(isAdmin ? materialHeaders.filter(x => x.key !== "stock") : materialHeaders.filter((header) => !header.isForAdmin)
      ).map((header) =>
        header.unit ? (
          <div>
            {" "}
            <span>{header.value}</span> <small>{header.unit}</small>
          </div>
        ) : (
          header.value
        )
      ),
      t("properties.more"),
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
        />,
      ];
    });
  }, [materialHeaders, materialCategoryData, activeFilter, materialFilter]);

  const tableRowsNew = useMemo(() => {
    return materialCategoryData.map((dataRow) => {
      const filteredHeaders = isAdmin
        ? materialHeaders.filter((x) => x.key !== "stock")
        : materialHeaders.filter((header) => !header.isForAdmin);
      return [
        <Checkbox
          onChange={(e, checked) => onChangeRowCheckBox(dataRow.id, checked)}
          checked={dataRow.checked}
        />,
        ...filteredHeaders.map((header) => (
          <TableCellData
            {...dataRow.rowData[header.key]}
            id={dataRow.id}
            isAdmin={isAdmin}
            parameterKey={header.key}
            onChangeRowCheckBox={onChangeRowCheckBox}
          />
        )),
        <MaterialMenuWidget
          dataRow={dataRow}
          isAdmin={isAdmin}
          onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
          onChangeRowCheckBox={onChangeRowCheckBox}
        />,
      ];
    });
  }, [materialHeaders, materialCategoryData, isAdmin, activeFilter, materialFilter]);


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

  const getPrintHouseMaterialCategorySuppliers = async (
    materialType: string,
    materialCategory: string
  ) => {
    const callBack = (res) => {
      if (res.success) {
        setMaterialCategorySuppliers(
          res?.data?.map((supplier) => {
            if (supplier.isDefault) {
              setDefaultSupplier(supplier.id);
            }
            return {
              isDefault: supplier.isDefault,
              value: supplier.id,
              label: supplier.name,
            };
          })
        );
      }
    };
    await getMaterialSuppliersApi(callApi, callBack, {
      key: materialType,
      categoryName: materialCategory,
    });
  };

  const setMachinesState = useSetRecoilState<[]>(materialsMachinesState);
  const getMachinesMaterials = useCallback(async () => {
    await getAndSetMachincesNew(callApi, setMachinesState);
  }, []);

  const setClientsState = useSetRecoilState<[]>(materialsClientsState);
  const getClientsMaterials = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setClientsState, {
      ClientType: "C",
      onlyCreateOrderClients: true,
    });
  }, []);

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
    onClickCloseDeleteTableRowModal,
    onDeleteCategoryRow,
    selectedTableRow,
    materialName,
    getClientsMaterials,
    productList
  };
};

export { useMaterials };
