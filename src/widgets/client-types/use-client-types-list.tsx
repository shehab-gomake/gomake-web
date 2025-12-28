import { useMemo, useState } from "react";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { useRecoilState } from "recoil";
import { IconButton } from "@mui/material";
import { CLIENT_TYPE, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { deleteClientTypeApi } from "@/services/api-service/customers/clientTypes-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { EditPencilIcon } from "@/components/icons/edit-pencil-icon";
import { TrashIcon } from "@/components/icons/trash-icon";

export const useClientTypesList = (clientType: CLIENT_TYPE) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultDelete } = useSnackBar();
  const { t } = useTranslation();

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const onCloseDeleteModal = () => {
    setSelectedTypeId("");
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (typeId) => {
    setSelectedTypeId(typeId);
    setOpenDeleteModal(true);
  };

  const [clientTypesCategories, setClientTypesCategories] = useRecoilState<any>(
    clientTypesCategoriesState
  );

  const cardTypeId =
    clientType === "C" ? CLIENT_TYPE_Id.CUSTOMER : CLIENT_TYPE_Id.SUPPLIER;

  const tableHeaders = [
    t("customers.name"),
    t("customers.modal.additionProfits"),
    t("sales.quote.discount"),
    t("customers.modal.excludeOutsourceJobs"),
    t("tabs.actions"),
  ];
  const [openModal, setOpenModal] = useState(false);
  const [selectedClientTypeId, setSelectedClientTypeId] = useState<
    string | null
  >(null);

  const handleEdit = (id: string) => {
    setSelectedClientTypeId(id);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    const callBack = (res) => {
      if (res.success) {
        setClientTypesCategories((prev) =>
          prev.filter((item) => item.id !== id)
        );
      } else {
        alertFaultDelete();
      }
    };
    await deleteClientTypeApi(callApi, callBack, { id });
  };

  const rows: React.ReactNode[][] = useMemo(() => {
    return clientTypesCategories.map((item) => [
      item?.label,
      `${item?.additionProfits}%`,
      `${item?.discount}%`,
      item?.excludeOutsourceJobs ? t("modal.yes") : t("modal.no"),
      <div key={`actions-${item.id}`}>
        <IconButton onClick={() => handleEdit(item.id)} size="small">
          <EditPencilIcon height={20} width={20} />
        </IconButton>
        <IconButton onClick={() => onOpenDeleteModal(item.id)} size="small">
          <TrashIcon height={20} width={20} />
        </IconButton>
      </div>,
    ]);
  }, [clientTypesCategories]);

  return {
    t,
    rows,
    tableHeaders,
    openModal,
    setOpenModal,
    selectedClientTypeId,
    clientTypesCategories,
    cardTypeId,
    handleDelete,
    openDeleteModal,
    selectedTypeId,
    onCloseDeleteModal,
  };
};
