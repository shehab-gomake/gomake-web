import { useMemo, useState } from "react";
import { clientTypesCategoriesState } from "@/pages/customers/customer-states";
import { useRecoilState } from "recoil";
import { IconButton } from "@mui/material";
import { RemoveIcon, EditIcon } from "@/icons";
import { CLIENT_TYPE, CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { deleteClientTypeApi } from "@/services/api-service/customers/clientTypes-api";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";

export const useClientTypes = (clientType: CLIENT_TYPE) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultDelete } = useSnackBar();
  const { t } = useTranslation();

  const [clientTypesCategories, setClientTypesCategories] = useRecoilState<any>(
    clientTypesCategoriesState
  );

  const clientTypeId =
    clientType === "C" ? CLIENT_TYPE_Id.CUSTOMER : CLIENT_TYPE_Id.SUPPLIER;

  const tableHeaders = [
    t("customers.name"),
    t("customers.modal.additionProfits"),
    t("sales.quote.discount"),
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
      <div key={`actions-${item.id}`}>
        <IconButton onClick={() => handleEdit(item.id)} size="small">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(item.id)} size="small">
          <RemoveIcon />
        </IconButton>
      </div>,
    ]);
  }, [clientTypesCategories]);

  return {
    rows,
    tableHeaders,
    openModal,
    setOpenModal,
    selectedClientTypeId,
    clientTypesCategories,
    clientTypeId,
  };
};
