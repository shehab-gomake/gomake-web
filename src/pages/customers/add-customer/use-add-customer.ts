import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAddCustomer = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { setSnackbarStateValue } = useSnackBar();


  const addNewCustomer = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("POST", `/v1/customers/add-customer`, {
        id: item?.id,
        customer: item , 
        clientType: item?.clientType,
        name: item?.name,
        fName: item?.fName,
        tel1: item?.tel1,
        phone: item?.phone,
        mail: item?.mail,
        clientTypeId: item?.clientTypeId,
      });
      if (res?.success) {

        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [state]
  );
  
  
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onOpenDeleteModal = (item: any) => {
    setOpenDeleteModal(true);
  };

  return {
    state,
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    addNewCustomer,
  };
};

export { useAddCustomer };