import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getMaterialsTypesApi,
  toggleMaterialTypeActiveApi,
} from "@/services/api-service/materials/materials-endpoints";
import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/components/icons/edit-icon";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EFilterStatus } from "./materials-table";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";

const useMaterialsTypes = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const [filter, setFilter] = useState<string>("");
  const [materialsTypes, setMaterialsTypes] = useState<
    { materialTypeKey: string; materialTypeName: string; isActive: boolean }[]
  >([]);
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const tableHeaders = [
    t("materials.materialsType"),
    t("materials.edit"),
    t("usersSettings.actions"),
  ];

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

  const [filterStatus, setFilterStatus] = useState<{
    label: string;
    value: EFilterStatus;
  }>();

  useEffect(() => {
    setFilterStatus(filterStatusList[1]);
  }, [filterStatusList]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    getAllMaterials().then();
  }, []);

  const [selectedMaterial, setSelectedMaterial] = useState<{
    materialTypeKey: string;
    materialTypeName: string;
  } | null>(null);
  const [anchorElMenuTable, setAnchorElMenuTable] =
    useState<null | HTMLElement>(null);
  const handleCloseMoreMenu = () => {
    setAnchorElMenuTable(null);
  };
  const handleOpenMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenuTable(event.currentTarget);
  };
  const onFilterChange = (e) => setFilter(e);
  const getAllMaterials = async () => {
    const callBack = (res) => {
      if (res.success) {
        setMaterialsTypes(res.data);
      }
    };
    await getMaterialsTypesApi(callApi, callBack);
  };

  const toggleMaterialTypeActive = async (materialTypeKey) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getAllMaterials();
      } else {
        alertFaultUpdate();
      }
    };
    await toggleMaterialTypeActiveApi(callApi, callBack, {
      key: materialTypeKey,
    });
  };

  const getTableRows = useCallback(() => {
    const basePath = isAdmin ? "/materials-admin" : "/materials";

    const filteredMaterials = materialsTypes.filter((material) => {
      const matchesFilter =
        !filter ||
        material.materialTypeName.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus =
        filterStatus.value === EFilterStatus.All ||
        (filterStatus.value === EFilterStatus.Active && material.isActive) ||
        (filterStatus.value === EFilterStatus.Inactive && !material.isActive);

      return matchesFilter && matchesStatus;
    });

    // const materials = !!filter ?
    //     materialsTypes.filter(material => material.materialTypeName.toLowerCase().includes(filter.toLowerCase()))
    //     : materialsTypes;

    return filteredMaterials.map((material) => [
      <>{material.materialTypeName}</>,
      <PrimaryButton
        data-tour={
          material.materialTypeKey === "sheets"
            ? "sheetMaterialsEdit"
            : undefined
        }
        startIcon={
          <EditIcon color={primaryColor(500)} width={20} height={20} />
        }
        href={basePath + `/${material.materialTypeKey}`}
        variant={"text"}
      >
        {t("machineAttributes.edit")}
      </PrimaryButton>,
      <PrimaryButton
        onClick={() => {
          toggleMaterialTypeActive(material?.materialTypeKey);
        }}
        startIcon={
          material?.isActive ? (
            <ToggleOffOutlinedIcon sx={{ fontSize: 24 }} />
          ) : (
            <ToggleOnOutlinedIcon sx={{ fontSize: 24 }} />
          )
        }
        variant={"text"}
      >
        {material?.isActive
          ? t("navigationButtons.deactivate")
          : t("navigationButtons.activate")}
      </PrimaryButton>,
    ]);
  }, [materialsTypes, filter, filterStatus]);

  return {
    t,
    getTableRows,
    onFilterChange,
    handleCloseMoreMenu,
    setFilterStatus,
    handleClick,
    handleClose,
    getAllMaterials,
    anchorElMenuTable,
    selectedMaterial,
    filterStatus,
    filterStatusList,
    tableHeaders,
    anchorEl,
    open,
  };
};

export { useMaterialsTypes };
