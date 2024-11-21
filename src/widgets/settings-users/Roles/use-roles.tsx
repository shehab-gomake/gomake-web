import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  deleteRoleApi,
  getAllRolesApi,
  updateRoleNameApi,
} from "@/services/api-service/users/roles-api";
import { IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useRoles = () => {
  const {
    alertFaultUpdate,
    alertSuccessUpdate,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const [allOriginRoles, setAllOriginRoles] = useState<any>([]);
  const [allRoles, setAllRoles] = useState<any>([]);
  const [modalState, setModalState] = useState<boolean>(false);
  const [deleteModalState, setDeleteModalState] = useState<boolean>(false);

  const [modalInputValue, setModalInputValue] = useState<string>("");
  const [updateRoleId, setUpdateRoleId] = useState<string>("");

  const onClickUpdate = (role) => {
    setModalState(true);
    setModalInputValue(role.name);
    setUpdateRoleId(role.id);
  };

  const onClickDelete = (roleId) => {
    setDeleteModalState(true);
    setUpdateRoleId(roleId);
  };

  const getAllRoles = () => {
    const callBackFunction = (res) => {
      if (res.success) {
        const rolesData = res.data.map((role) => [
          role?.name,
          <Stack direction={"row"} justifyContent={"center"}>
            <IconButton onClick={() => onClickUpdate(role)}>
              <EditPencilIcon height={20} width={20} />
            </IconButton>

            <IconButton onClick={() => onClickDelete(role?.id)}>
              <TrashIcon height={20} width={20} />
            </IconButton>
          </Stack>,
        ]);

        setAllRoles(rolesData);
        setAllOriginRoles(res.data);
      }
    };
    getAllRolesApi(callApi, callBackFunction).then();
  };

  const tableHeaders = [
    t("permissionsSettings.Role name"),
    t("properties.more"),
  ];

  const updateRoleName = async () => {
    const callBack = (res) => {
      if (res.success) {
        debugger;
        alertSuccessUpdate();
        getAllRoles();
        setModalInputValue("");
        setUpdateRoleId("");
        setModalState(false);
      } else {
        alertFaultUpdate();
      }
    };
    const role = allOriginRoles.find((r) => r?.id === updateRoleId);
    await updateRoleNameApi(callApi, callBack, {
      id: updateRoleId,
      name: modalInputValue,
      recordID: role?.recordID,
    });
  };

  const deleteRole = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        getAllRoles();
        setUpdateRoleId("");
        setDeleteModalState(false);
      } else {
        alertFaultDelete();
      }
    };
    await deleteRoleApi(callApi, callBack, {
      roleId: updateRoleId,
    });
  };

  return {
    t,
    getAllRoles,
    tableHeaders,
    allRoles,
    modalState,
    modalInputValue,
    updateRoleId,
    setModalState,
    setModalInputValue,
    updateRoleName,
    deleteRole,
    deleteModalState,
    setDeleteModalState,
  };
};

export { useRoles };
