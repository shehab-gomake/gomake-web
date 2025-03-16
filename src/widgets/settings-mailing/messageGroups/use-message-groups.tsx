import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  deleteRoleApi,
  getAllRolesApi,
  updateRoleNameApi,
} from "@/services/api-service/users/roles-api";
import { IconButton, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { allSMSTemplateGroupsState } from "../states/state";
import { deleteSMSTemplateGroupApi } from "@/services/api-service/mailing/mailing-api";

const useMessageGroups = (getSMSTemplateGroups) => {
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
  const [updateGroupId, setUpdateGroupId] = useState<string>("");

  const onClickUpdate = (role) => {
    setModalState(true);
    setModalInputValue(role.name);
    setUpdateGroupId(role.id);
  };

  const onClickDelete = (roleId) => {
    setDeleteModalState(true);
    setUpdateGroupId(roleId);
  };

  const onCloseDeleteModal = () => {
    setDeleteModalState(false);
    setUpdateGroupId("");
  };

  const tableHeaders = [
    t("mailingSettings.groupName"),
    t("mailingSettings.groupAgent"),
    t("properties.more"),
  ];

  const updateMessageGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setModalInputValue("");
        setUpdateGroupId("");
        setModalState(false);
      } else {
        alertFaultUpdate();
      }
    };
    const role = allOriginRoles.find((r) => r?.id === updateGroupId);
    await updateRoleNameApi(callApi, callBack, {
      id: updateGroupId,
      name: modalInputValue,
      recordID: role?.recordID,
    });
  };

  const deleteMessageGroups = async (groupId: string) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        setUpdateGroupId("");
        setDeleteModalState(false);
        getSMSTemplateGroups();
      } else {
        alertFaultDelete();
      }
    };
    await deleteSMSTemplateGroupApi(callApi, callBack, {
      groupId: updateGroupId,
    });
  };

  const allSMSTemplateGroups = useRecoilValue<any>(allSMSTemplateGroupsState);
  const SMSTemplatesGroups = useMemo(
    () =>
      allSMSTemplateGroups.map(
        (group: { value: string; text: string; agentId: string }) => [
          group?.text,
          group?.agentId, // Display value

          <Stack direction="row" justifyContent="center" key={group?.value}>
            <IconButton
            //  onClick={() => onClickUpdate(role)}
            >
              <EditPencilIcon height={20} width={20} />
            </IconButton>
            <IconButton onClick={() => onClickDelete(group.value)}>
              <TrashIcon height={20} width={20} />
            </IconButton>
          </Stack>,
        ]
      ),
    [allSMSTemplateGroups, onClickUpdate, onClickDelete]
  );

  return {
    t,
    tableHeaders,
    allRoles,
    modalState,
    modalInputValue,
    updateGroupId,
    setModalState,
    setModalInputValue,
    updateMessageGroups,
    deleteMessageGroups,
    deleteModalState,
    setDeleteModalState,
    SMSTemplatesGroups,
    onCloseDeleteModal,
  };
};

export { useMessageGroups };
