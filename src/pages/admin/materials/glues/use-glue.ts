import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllGlues } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useColors = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.glues.typeName"),
      t("materials.doubleSidedTapeRolls.admin.settings"),
    ],
    []
  );
  const [openAddMagnetModal, setOpenAddApplicationsModal] = useState(false);
  const [openUpdateMagnetModal, setOpenAddMagnetModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allMagnets, setAllMagnets] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [selectedMagnet, setSelectedMagnet] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      typeName: "",
      volumeInLiters: "",
      literPerSquareMeter: "",
      pricePerLiter: "",
      pricePerContainer: "",
      inkConsumption: "",
      conditions: "",
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

  const onChangeUpdateStateMagnet = useCallback(
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

  const getMagnets = useCallback(async () => {
    await getAndSetGetAllGlues(callApi, setAllMagnets);
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
        literPerSquareMeter: "",
        pricePerLiter: "",
        pricePerContainer: "",
        inkConsumption: "",
        conditions: "",
      },
    ]);
    setOpenAddApplicationsModal(true);
  };
  const onCloseUpdateModal = async () => {
    getMagnets();
    setOpenAddMagnetModal(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateApplicationThickness(item);
    setSelectedEditItem(item);
    setOpenAddMagnetModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedMagnet(item);
  };

  const addMagnet = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-magnet`, {
      ...items[0],
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getMagnets();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);

  const deleteMagnet = useCallback(async (code: string) => {
    const res = await callApi(
      "POST",
      `/v1/administrator/delete-double-sided-tape-roll`,
      {
        code,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      getMagnets();
      onCloseDeleteModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);

  const updateMagnet = useCallback(
    async (code: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-magnet?code=${code}`,
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
        // getMagnets();
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
  const updateApplicationThicknessSize = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-application-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`,
        {
          ...updateState[sizeId],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        // getMagnets();
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
    getMagnets();
  }, []);
  return {
    headerTable,
    allMagnets,
    openAddMagnetModal,
    items,
    categoryName,
    openUpdateMagnetModal,
    selectedEditItem,
    openDeleteModal,
    selectedMagnet,
    updateState,
    onChangeUpdateStateMagnet,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addMagnet,
    setOpenAddMagnetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteMagnet,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMagnet,
    updateApplicationThicknessSize,
  };
};

export { useColors };
