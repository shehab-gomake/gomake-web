import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { IconButton, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { allSMSTemplateGroupsState } from "../states/state";
import {
  deleteSMSTemplateGroupApi,
  updateSMSTemplateGroupApi,
} from "@/services/api-service/mailing/mailing-api";

const useMessageGroups = () => {
  const {
    alertFaultUpdate,
    alertSuccessUpdate,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allSMSTemplateGroups, setAllSMSTemplateGroups] = useRecoilState<any>(
    allSMSTemplateGroupsState
  );
  const [editModalState, setEditModalState] = useState<boolean>(false);
  const [deleteModalState, setDeleteModalState] = useState<boolean>(false);
  const [updateGroupId, setUpdateGroupId] = useState<string>("");
  const [updateGroupState, setUpdateGroupState] = useState<{
    id: string;
    name: string;
    recordID: number;
  }>();

  const onClickUpdate = (group) => {
    setEditModalState(true);
    setUpdateGroupState(group);
  };

  const onClickDelete = (roleId) => {
    setDeleteModalState(true);
    setUpdateGroupId(roleId);
  };

  const onCloseDeleteModal = () => {
    setDeleteModalState(false);
    setUpdateGroupId("");
    setUpdateGroupState({
      id: "",
      name: "",
      recordID: 0,
    });
  };

  const onCloseEditModal = () => {
    setEditModalState(false);
  };

  const tableHeaders = [t("mailingSettings.groupName"), t("properties.more")];

  const updateMessageGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        setEditModalState(false);
        setAllSMSTemplateGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === updateGroupState.id
              ? { ...group, ...updateGroupState }
              : group
          )
        );
      } else {
        alertFaultUpdate();
      }
    };
    await updateSMSTemplateGroupApi(callApi, callBack, updateGroupState);
  };

  const deleteMessageGroups = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        setUpdateGroupId("");
        setDeleteModalState(false);
        setAllSMSTemplateGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== updateGroupId)
        );
      } else {
        alertFaultDelete();
      }
    };
    await deleteSMSTemplateGroupApi(callApi, callBack, {
      groupId: updateGroupId,
    });
  };

  const SMSTemplatesGroups = useMemo(
    () =>
      allSMSTemplateGroups.map(
        (group: {
          id: string;
          name: string;
          agentId: string;
          recordID: number;
        }) => [
          group?.name,
          <Stack direction="row" justifyContent="center" key={group?.id}>
            <IconButton onClick={() => onClickUpdate(group)}>
              <EditPencilIcon height={20} width={20} />
            </IconButton>
            <IconButton onClick={() => onClickDelete(group.id)}>
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
    updateGroupId,
    updateMessageGroups,
    deleteMessageGroups,
    deleteModalState,
    setDeleteModalState,
    SMSTemplatesGroups,
    onCloseDeleteModal,
    editModalState,
    onCloseEditModal,
    updateGroupState,
    setUpdateGroupState,
  };
};

export { useMessageGroups };
