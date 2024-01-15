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
  materialsMachinesState,
  materialsUnCheckedState,
  openAddRowModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { useTranslation } from "react-i18next";
import { useAddCategoryRow } from "./components/add-row/use-add-row";
import { WastebasketNew } from "@/icons/wastebasket-new";

import { getAndSetMachincesNew } from "@/services/hooks";
import { MaterialMenuWidget } from "./components/more-circle";
import cloneDeep from "lodash.clonedeep";
import { SideLeftMenuWidget } from "./components/side-list-menu";

const useMaterials = (isAdmin: boolean) => {
  const { query, push, replace } = useRouter();

  const { materialType, materialCategory } = query;
  const [materialHeaders, setMaterialHeaders] =
    useRecoilState<{ key: string; value: string; unit?: string }[]>(
      materialHeadersState
    );
  const [materialCategories, setMaterialCategories] = useRecoilState<
    {
      categoryKey: string;
      categoryName: string;
      isAddedByPrintHouse: boolean;
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
  const onClickOpenDeleteRowModal = () => {
    setOpenDeleteRowModal(true);
  };
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] =
    useState<boolean>(false);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };
  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };
  const setMaterialCategorySuppliers = useSetRecoilState(
    materialCategorySuppliersState
  );
  const [materialName, setMaterialName] = useState<string>();
  const setMaterialActions = useSetRecoilState(materialActionState);
  const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
  const activeFilter = useRecoilValue(activeFilterState);
  const materialFilter = useRecoilValue(filterState);
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
  };
  const [selectedTableRow, setSelectedTableRow] = useState<any>();
  const onDeleteCategory = async (categoryKey) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
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
      icon: category.isAddedByPrintHouse
        ? () => (
            <SideLeftMenuWidget
              onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
              setSelectedCategory={setSelectedCategory}
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
        setMaterialName(res.data?.materialTypeName)
      }
    };
    await getMaterialTableHeadersApi(callApi, callBack, materialType);
  };

  const isAllSelected = useCallback(() => {
    return materialCategoryData.every((row) => row.checked);
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
    setMaterialCategoryData(
      materialCategoryData.map((row) =>
        id === row.id ? { ...row, checked: !row.checked } : row
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
      ...materialHeaders.map((header) =>
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

  ///////////////////////////////////////////////////////////

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
          />
        )),
        <MaterialMenuWidget
          dataRow={dataRow}
          isAdmin={isAdmin}
          setSelectedTableRow={setSelectedTableRow}
          onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
          onClickDelete={onDeleteCategoryRow}
        />,
        // <IconButton onClick={() => onDeleteCategoryRow(dataRow.id)}>
        //   <WastebasketNew width={"30px"} height={"30px"} />
        // </IconButton>,
      ];
    });
  }, [materialHeaders, materialCategoryData, activeFilter, materialFilter]);

  const tableRowsNew = useMemo(() => {
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
          />
        )),
        <MaterialMenuWidget
          dataRow={dataRow}
          isAdmin={isAdmin}
          setSelectedTableRow={setSelectedTableRow}
          onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
          onClickDelete={onDeleteCategoryRow}
        />,
        // <IconButton onClick={() => onDeleteCategoryRow(dataRow.id)}>
        //   <WastebasketNew width={"30px"} height={"30px"} />
        // </IconButton>,
      ];
    });
  }, [materialHeaders, materialCategoryData, activeFilter, materialFilter]);

  ///////////////////////////////////////////////////////////

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
    materialName
  };
};

export { useMaterials };