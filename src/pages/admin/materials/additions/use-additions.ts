import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllAdditions } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useApplications = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.additions.admin.name"),
      t("materials.additions.admin.settings"),
    ],
    []
  );
  const [openAddApplicationsModal, setOpenAddApplicationsModal] =
    useState(false);
  const [openUpdatalApplicationModal, setOpenUpdatalApplicationModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allAdditions, setAllAdditions] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [selectedAddition, setSelectedAddition] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      adaptationField: "",
      defaultPrice: "",
      weight: "",
    },
  ]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };

  const [updateState, setUpdateState] = useState({});

  const onChangeUpdateStateAddition = useCallback(
    (filedName: string, value: any) => {
      setUpdateState((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [updateState]
  );
  const onClickOpenHardboardSizeThicknessWidget = (item) => {
    setItems([
      {
        code: "",
        name: "",
        adaptationField: "",
        defaultPrice: "",
        weight: "",
      },
    ]);
  };
  const initialStateApplicationThickness = (item: any) => {
    setUpdateState(item);
  };

  const getAdditions = useCallback(async () => {
    await getAndSetGetAllAdditions(callApi, setAllAdditions);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddApplicationsModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        name: "",
        adaptationField: "",
        defaultPrice: "",
        weight: "",
      },
    ]);
    setOpenAddApplicationsModal(true);
  };
  const onCloseUpdateModal = async () => {
    getAdditions();
    setOpenUpdatalApplicationModal(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateApplicationThickness(item);
    setSelectedEditItem(item);
    setOpenUpdatalApplicationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedAddition(item);
  };

  const addNewAddition = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-addition`, {
      ...items[0],
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getAdditions();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);

  const deleteAddition = useCallback(async (code: string) => {
    const res = await callApi("POST", `/v1/administrator/delete-addition`, {
      code,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      getAdditions();
      onCloseDeleteModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);

  const updateAddition = useCallback(
    async (code: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-addition?code=${code}`,
        {
          ...updateState,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        // getAdditions();
        // onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );

  useEffect(() => {
    getAdditions();
  }, []);
  return {
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdatalApplicationModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    onClickOpenHardboardSizeThicknessWidget,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewAddition,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteAddition,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
  };
};

export { useApplications };
