import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { IconButton } from "@mui/material";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { clientGroupsCategoriesState } from "@/pages/customers/customer-states";
import { deleteClientGroupApi } from "@/services/api-service/customers/client-groups-api";
import { getClientsGroupsApi } from "@/services/api-service/suppliers/suppliers-endpoints";

export const useClientGroupsList = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultDelete } = useSnackBar();
  const { t } = useTranslation();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const onCloseDeleteModal = () => {
    setSelectedGroupId("");
    setOpenDeleteModal(false);
  };

  const onOpenDeleteModal = (GroupId) => {
    setSelectedGroupId(GroupId);
    setOpenDeleteModal(true);
  };

  const [clientGroupsCategories, setClientGroupsCategories] =
    useRecoilState<any>(clientGroupsCategoriesState);

  const tableHeaders = [t("customers.name"), t("tabs.actions")];
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientGroupId, setSelectedClientGroupId] = useState<
    string | null
  >(null);

  const onCloseAddEditModal = () => {
    setSelectedClientGroupId(null);
    setOpenModal(false);
  };

  const handleEdit = (id: string) => {
    setSelectedClientGroupId(id);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const callBack = (res) => {
      if (res.success) {
        setClientGroupsCategories((prev) =>
          prev.filter((item) => item.id !== id)
        );
      } else {
        alertFaultDelete();
      }
    };
    await deleteClientGroupApi(callApi, callBack, { id });
  };

  const getClientsGroups = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setClientGroupsCategories(res?.data);
      }
    };
    await getClientsGroupsApi(callApi, callBack);
  };

  const rows: React.ReactNode[][] = useMemo(() => {
    return clientGroupsCategories.map((item) => [
      item?.groupName,
      <div key={`actions-${item.id}`}>
        <IconButton onClick={() => handleEdit(item.id)} size="small">
          <EditPencilIcon height={20} width={20} />
        </IconButton>
        <IconButton onClick={() => onOpenDeleteModal(item.id)} size="small">
          <TrashIcon height={20} width={20} />
        </IconButton>
      </div>,
    ]);
  }, [clientGroupsCategories]);

  return {
    t,
    rows,
    tableHeaders,
    openModal,
    setOpenModal,
    selectedClientGroupId,
    clientGroupsCategories,
    handleDelete,
    openDeleteModal,
    selectedGroupId,
    onCloseDeleteModal,
    onCloseAddEditModal,
    getClientsGroups,
  };
};
