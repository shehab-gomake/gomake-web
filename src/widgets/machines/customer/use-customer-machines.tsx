import { useMemo } from "react";
import { useCallback, useEffect } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useState } from "react";
import { Permissions } from "@/components/CheckPermission/enum";
import { EFilterStatus } from "@/widgets/materials-widget/components/materials-table/materials-table";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { EditIcon } from "@/components/icons/edit-icon";
import { PrimaryButton } from "@/components/button/primary-button";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { machineCategoriesState } from "@/store/machine-categories";
import { useUserPermission } from "@/hooks/use-permission";
import { useTranslation } from "react-i18next";
import { getPrintHouseMachineCategories, togglePrintHouseMachineCategory } from "@/services/api-service/machines/print-house-machines";
import { ECategoryId } from "../enums/category-id";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";

const useCustomerMachinesCategories = () => {
  const [filter, setFilter] = useState<string>("");
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const categoriesList = useRecoilValue(machineCategoriesState);
  const { CheckPermission } = useUserPermission();
  const [printHouseMachineCategories, setPrintHouseMachineCategories] = useState<any[]>([]);
  
  const categories = useCallback(() => {
    if (!!filter) {
      return categoriesList.filter((category) =>
        t(category.name).toLowerCase().includes(filter.toLowerCase())
      );
    }
    return categoriesList;
  }, [filter, categoriesList]);
  
  const onFilterChange = (e) => setFilter(e);
  
  const getPrintHouseMachineCategoriesApi = async () => {
    const callBack = res => {
      if (res.success) {
        setPrintHouseMachineCategories(res.data)
      }
    }
    await getPrintHouseMachineCategories(callApi, callBack, false);
  }
  
  useEffect(() => {
    getPrintHouseMachineCategoriesApi()
  }, [])

  const tableHeaders = [
    t('machineAttributes.category'),
    CheckPermission(Permissions.EDIT_MACHINE) ? t('machineAttributes.editMachine') : null,
    t("usersSettings.actions"),
  ];
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const filterStatusList = useMemo(
    () => [
      {
        label: t("navigationButtons.all"),
        value: EFilterStatus.All,
      },
      {
        label: t("navigationButtons.active"),
        value: EFilterStatus.Active,
      },
      {
        label: t("navigationButtons.inactive"),
        value: EFilterStatus.Inactive,
      },
    ],
    [t]
  );
  
  const printHouseCategoryIds = printHouseMachineCategories.map(item => item.category);

  const [filterStatus, setFilterStatus] = useState<{
    label: string;
    value: EFilterStatus;
  }>();
  
  const toggleCategoryActive = async (categoryId: string) => {
    const callBack = res => {
      if (res.success) {
        getPrintHouseMachineCategoriesApi()
      }
    }
    await togglePrintHouseMachineCategory(callApi, callBack, { category: categoryId });
  }

  useEffect(() => {
    setFilterStatus(filterStatusList[1]);
  }, [filterStatusList]);

  const filteredCategories = () => {
    if (!filterStatus) {
      return categories();
    }
    if (filterStatus.value === EFilterStatus.All) {
      return categories();
    }
    if (filterStatus.value === EFilterStatus.Active) {
      // Show categories NOT in printHouseCategoryIds
      return categories()?.filter(category => !printHouseCategoryIds.includes(category.id));
    }
    if (filterStatus.value === EFilterStatus.Inactive) {
      // Show categories ONLY in printHouseCategoryIds
      return categories()?.filter(category => printHouseCategoryIds.includes(category.id));
    }
    return categories();
  };
  
  const tableRows = filteredCategories()?.map((category) => [
    <>{t(category.name)}</>,
    <PermissionCheck userPermission={Permissions.EDIT_MACHINE}>
      <PrimaryButton
        data-tour={category.id === ECategoryId.DIGITAL_PRINTING ? 'editDigitalPrinting' : undefined}
        startIcon={<EditIcon color={primaryColor(500)} width={20} height={20} />}
        href={`/machines/category/${category.id}`}
        variant={"text"}
      >
        {t('machineAttributes.edit')}
      </PrimaryButton>
    </PermissionCheck>,
    <PrimaryButton
      onClick={() => {
        toggleCategoryActive(category.id);
      }}
      startIcon={
        printHouseCategoryIds.includes(category.id) ? (
          <ToggleOnOutlinedIcon sx={{ fontSize: 24 }} />
        ) : (
          <ToggleOffOutlinedIcon sx={{ fontSize: 24 }} />
        )
      }
      variant={"text"}
    >
      {printHouseCategoryIds.includes(category.id)
        ? t("navigationButtons.activate")
        : t("navigationButtons.deactivate")}
    </PrimaryButton>,
  ]);
  
  return {
    tableHeaders,
    tableRows,
    filterStatus,
    filterStatusList,
    open,
    anchorEl,
    handleClick,
    handleClose,
    setFilterStatus,
    onFilterChange,
    t,
  };
};

export { useCustomerMachinesCategories };
