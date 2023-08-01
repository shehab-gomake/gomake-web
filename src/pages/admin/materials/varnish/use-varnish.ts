import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllVarnish } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useVarnish = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.name"),
      t("materials.doubleSidedTapeRolls.admin.settings"),
    ],
    []
  );
  const [openAddVarnishModal, setOpenAddApplicationsModal] = useState(false);
  const [openUpdateVarnishModal, setOpenAddVarnishModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allVarnish, setAllVarnish] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [selectedVarnish, setSelectedVarnish] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      typeName: "",
      volumeInLiters: "",
      weightOfLiter: "",
      literInSquareMeter: "",
      defaultPricePerLiter: "",
      defaultPricePerContainer: "",
      inkConsumption: "",
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

  const onChangeUpdateStateVarnish = useCallback(
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

  const initialStateApplicationThickness = (item: any) => {
    setUpdateState(item);
  };

  const getVarnish = useCallback(async () => {
    await getAndSetGetAllVarnish(callApi, setAllVarnish);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddApplicationsModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        typeName: "",
        volumeInLiters: "",
        weightOfLiter: "",
        literInSquareMeter: "",
        defaultPricePerLiter: "",
        defaultPricePerContainer: "",
        inkConsumption: "",
      },
    ]);
    setOpenAddApplicationsModal(true);
  };
  const onCloseUpdateModal = async () => {
    getVarnish();
    setOpenAddVarnishModal(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateApplicationThickness(item);
    setSelectedEditItem(item);
    setOpenAddVarnishModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedVarnish(item);
  };

  const addVarnish = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/varnish/add-varnish`, {
      ...items[0],
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getVarnish();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);

  const updateVarnish = useCallback(
    async (code: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/varnish/update-varnish?code=${code}`,
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
        // getVarnish();
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
    getVarnish();
  }, []);
  return {
    headerTable,
    allVarnish,
    openAddVarnishModal,
    items,
    categoryName,
    openUpdateVarnishModal,
    selectedEditItem,
    openDeleteModal,
    selectedVarnish,
    updateState,
    onChangeUpdateStateVarnish,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addVarnish,
    setOpenAddVarnishModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateVarnish,
  };
};

export { useVarnish };
